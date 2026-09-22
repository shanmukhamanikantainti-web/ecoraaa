"""
PEGASUS OS — Base Agent

Abstract base class for all PEGASUS agents.
Defines the agent lifecycle, state machine, tool interface, and tool execution loop.

Agent states: IDLE → PLANNING → RUNNING → WAITING → COMPLETED / FAILED → PAUSED / STOPPED
"""

import asyncio
import json
import logging
import time
from abc import ABC, abstractmethod
from enum import Enum
from typing import Any, Optional

logger = logging.getLogger("pegasus.agents")


class AgentState(str, Enum):
    IDLE = "IDLE"
    PLANNING = "PLANNING"
    RUNNING = "RUNNING"
    WAITING = "WAITING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    PAUSED = "PAUSED"
    STOPPED = "STOPPED"


class BaseAgent(ABC):
    """
    Abstract base for all PEGASUS agents.
    Each agent specializes in a class of tasks and uses tools to execute them.
    """

    def __init__(self, name: str):
        self.name = name
        self.state: AgentState = AgentState.IDLE
        self.current_task: Optional[str] = None
        self.runtime: float = 0
        self._start_time: Optional[float] = None
        self._retry_count: int = 0
        self.max_retries: int = 3

    @abstractmethod
    def can_handle(self, task_description: str) -> bool:
        """Determine if this agent can handle the given task."""
        pass

    @abstractmethod
    async def execute(self, step: Any, tools: dict[str, Any], context: Any) -> str:
        """
        Execute a mission step using available tools.
        Returns a result string.
        """
        pass

    async def run(self, step: Any, tools: dict[str, Any], context: Any) -> str:
        """Wrapper that manages agent lifecycle around execute()."""
        self.state = AgentState.PLANNING
        self.current_task = step.name
        self._start_time = time.time()
        self.context = context # Store context
        self.tools = tools # Store tools

        try:
            self.state = AgentState.RUNNING
            logger.info(f"[{self.name}] Starting: {step.name}")

            result = await self.execute(step, tools, context)

            self.state = AgentState.COMPLETED
            self.runtime = time.time() - self._start_time
            logger.info(f"[{self.name}] Completed: {step.name} ({self.runtime:.1f}s)")

            return result

        except Exception as e:
            self.state = AgentState.FAILED
            self.runtime = time.time() - self._start_time
            logger.error(f"[{self.name}] Failed: {step.name} - {e}")
            raise

        finally:
            self.current_task = None
            self.context = None
            self.tools = None

    def pause(self):
        """Pause the agent."""
        if self.state == AgentState.RUNNING:
            self.state = AgentState.PAUSED

    def resume(self):
        """Resume the agent."""
        if self.state == AgentState.PAUSED:
            self.state = AgentState.RUNNING

    def stop(self):
        """Stop the agent."""
        self.state = AgentState.STOPPED
        self.current_task = None

    def reset(self):
        """Reset agent to idle state."""
        self.state = AgentState.IDLE
        self.current_task = None
        self.runtime = 0
        self._start_time = None
        self._retry_count = 0

    def _use_tool(self, tools: dict[str, Any], tool_name: str) -> Optional[Any]:
        """Get a tool by name."""
        return tools.get(tool_name)

    async def _llm_call(self, system_prompt: str, user_prompt: str) -> str:
        """Make an LLM API call using OpenRouter primary service."""
        # Extract event callback and task ID from context if available
        on_event = getattr(self.context, 'event_callback', None) if hasattr(self, 'context') else None
        task_id = getattr(self.context, 'active_task_id', None) if hasattr(self, 'context') else None

        try:
            from ..services.llm import llm_service
            response = await llm_service.chat_completion(
                messages=[{"role": "user", "content": user_prompt}],
                system_prompt=system_prompt,
                temperature=0.3,
                max_tokens=2000,
                on_event=on_event,
                task_id=task_id
            )
            if "[Error:" in response or "[OpenRouter Error]" in response:
                raise Exception(response)
            return response
        except Exception as e:
            logger.error(f"OpenRouter LLM call failed: {e}")
            raise e # Ensure orchestrator catches it

    async def _execute_tool_call(self, tool_name: str, action: str, args: dict, tools: dict[str, Any]) -> str:
        """Execute a single tool action safely."""
        tool = tools.get(tool_name)
        if not tool:
            return f"Error: Tool '{tool_name}' not available."

        try:
            if tool_name == "filesystem":
                if action == "read_file":
                    res = await tool.read_file(args.get("path", ""))
                    return res if res is not None else "File not found or empty."
                elif action == "write_file":
                    ok = await tool.write_file(args.get("path", ""), args.get("content", ""))
                    return "File written successfully." if ok else "Failed to write file."
                elif action == "list_directory":
                    items = await tool.list_directory(args.get("path", "."))
                    return json.dumps(items, indent=2)
                elif action == "search":
                    results = await tool.search(args.get("query", ""), args.get("path", "."))
                    return json.dumps(results, indent=2)
                elif action == "get_metadata":
                    meta = await tool.get_metadata(args.get("path", ""))
                    return json.dumps(meta, indent=2) if meta else "Path not found."

            elif tool_name == "terminal":
                if action == "execute":
                    cmd = args.get("command", "")
                    return await tool.execute(cmd, timeout=args.get("timeout", 60))

            elif tool_name == "browser":
                if action == "search":
                    res = await tool.search(args.get("query", ""))
                    return json.dumps(res, indent=2)
                elif action == "extract":
                    res = await tool.extract(args.get("url", ""))
                    return res if res is not None else "No content extracted."

            return f"Error: Unknown action '{action}' for tool '{tool_name}'."
        except Exception as e:
            logger.error(f"Tool execution failed ({tool_name}.{action}): {e}")
            return f"Tool execution error: {str(e)}"

    async def _execute_tool_loop(
        self,
        task: str,
        tools: dict[str, Any],
        system_prompt: str,
        max_turns: int = 5
    ) -> str:
        """
        Execute an iterative tool calling loop where the LLM decides the next action.
        """
        messages_history = [
            f"Goal: {task}\n\nSelect a tool action using JSON format or provide final answer as result."
        ]

        tool_descriptions = """Available tools:
1. filesystem:
   - read_file(path: string)
   - write_file(path: string, content: string)
   - list_directory(path: string)
   - search(query: string, path: string)
2. terminal:
   - execute(command: string)
3. browser:
   - search(query: string)
   - extract(url: string)

To call a tool, respond with ONLY a JSON object:
{"tool": "<tool_name>", "action": "<action_name>", "args": {<args_map>}}

To finish and respond to user, respond with ONLY a JSON object:
{"result": "<final_response_text>"}"""

        full_system_prompt = f"{system_prompt}\n\n{tool_descriptions}"

        for turn in range(max_turns):
            user_prompt = "\n\n".join(messages_history)
            response = await self._llm_call(full_system_prompt, user_prompt)

            if not response or "LLM unavailable" in response or "[Error:" in response or "[OpenRouter Error]" in response:
                logger.warning(f"[{self.name}] LLM unavailable or error during loop turn {turn}: {response}")
                # Fallback to direct heuristic action or return the response
                return response

            # Clean response to parse JSON
            cleaned_resp = response.strip()
            if cleaned_resp.startswith("```json"):
                cleaned_resp = cleaned_resp[7:].strip()
            if cleaned_resp.startswith("```"):
                cleaned_resp = cleaned_resp[3:].strip()
            if cleaned_resp.endswith("```"):
                cleaned_resp = cleaned_resp[:-3].strip()

            try:
                data = json.loads(cleaned_resp)
                if "result" in data:
                    return str(data["result"])
                elif "tool" in data and "action" in data:
                    tool_name = data["tool"]
                    action = data["action"]
                    args = data.get("args", {})

                    logger.info(f"[{self.name}] Tool Loop Turn {turn + 1}: {tool_name}.{action}({args})")
                    tool_output = await self._execute_tool_call(tool_name, action, args, tools)

                    messages_history.append(f"Action: Call {tool_name}.{action}({args})\nResult:\n{tool_output[:2000]}")
                else:
                    # Not standard JSON format, treat as plain response
                    return response
            except json.JSONDecodeError:
                # If LLM replied with non-JSON text, treat it as the final answer
                return response

        return f"Completed maximum allowed tool iterations for task: {task}"

    def to_dict(self) -> dict:
        """Serialize agent state."""
        return {
            "name": self.name,
            "type": type(self).__name__,
            "state": self.state.value,
            "current_task": self.current_task,
            "runtime": self.runtime,
        }
