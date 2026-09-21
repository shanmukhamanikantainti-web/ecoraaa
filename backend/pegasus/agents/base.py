"""
PEGASUS OS — Base Agent

Abstract base class for all PEGASUS agents.
Defines the agent lifecycle, state machine, and tool interface.

Agent states: IDLE → PLANNING → RUNNING → WAITING → COMPLETED / FAILED → PAUSED / STOPPED
"""

import asyncio
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
        """Make an LLM API call."""
        try:
            from ..config.settings import settings

            if settings.openai_api_key:
                import openai
                client = openai.AsyncOpenAI(api_key=settings.openai_api_key)
                response = await client.chat.completions.create(
                    model=settings.openai_model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.3,
                    max_tokens=2000
                )
                return response.choices[0].message.content

            elif settings.anthropic_api_key:
                import anthropic
                client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
                response = await client.messages.create(
                    model=settings.anthropic_model,
                    max_tokens=2000,
                    system=system_prompt,
                    messages=[{"role": "user", "content": user_prompt}]
                )
                return response.content[0].text

        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            return f"LLM unavailable: {e}"

    def to_dict(self) -> dict:
        """Serialize agent state."""
        return {
            "name": self.name,
            "type": type(self).__name__,
            "state": self.state.value,
            "current_task": self.current_task,
            "runtime": self.runtime,
        }
