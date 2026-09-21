"""
PEGASUS OS — Coding Agent

Capabilities:
- Code generation
- Code inspection
- Code modification
- Controlled execution
- Error detection
- Iterative correction
- File creation and modification

Code execution shall be subject to permission and sandbox restrictions.
"""

import logging
from typing import Any

from .base import BaseAgent

logger = logging.getLogger("pegasus.agents.coding")


class CodingAgent(BaseAgent):
    """
    Coding Agent specializes in generating, executing, and debugging code.
    Uses the terminal and filesystem tools.
    """

    def __init__(self):
        super().__init__(name="Coding Agent")

    def can_handle(self, task_description: str) -> bool:
        """Coding agent handles code, write, create, execute, run, debug tasks."""
        keywords = [
            "code", "write", "create", "generate", "execute", "run",
            "test", "debug", "fix", "simulate", "script", "program",
            "function", "class", "module", "build", "compile", "python"
        ]
        return any(kw in task_description.lower() for kw in keywords)

    async def execute(self, step: Any, tools: dict[str, Any], context: Any) -> str:
        """Execute a coding step."""
        task = step.name
        logger.info(f"[Coding] Executing: {task}")

        filesystem = self._use_tool(tools, "filesystem")
        terminal = self._use_tool(tools, "terminal")

        # Determine if we need to generate code or execute existing code
        if self._needs_code_generation(task):
            return await self._generate_and_run(task, filesystem, terminal, context)
        elif self._needs_execution(task):
            return await self._execute_task(task, terminal)
        else:
            return await self._general_task(task, filesystem, terminal, context)

    async def _generate_and_run(
        self, task: str, filesystem: Any, terminal: Any, context: Any
    ) -> str:
        """Generate code and run it."""
        # Generate code using LLM
        code = await self._llm_call(
            system_prompt="""You are a Python coding assistant. Generate clean, working Python code.
Return ONLY the code, no markdown formatting or explanation.
Make sure the code is complete and can run independently.""",
            user_prompt=f"Write a Python script that: {task}"
        )

        if not code or code.startswith("LLM unavailable"):
            return f"Could not generate code for: {task}"

        # Clean up code (remove markdown fences if present)
        code = code.strip()
        if code.startswith("```python"):
            code = code[len("```python"):].strip()
        if code.startswith("```"):
            code = code[3:].strip()
        if code.endswith("```"):
            code = code[:-3].strip()

        # Save the code
        filename = f"{task[:30].replace(' ', '_').replace('/', '_')}.py"
        if filesystem:
            await filesystem.write_file(filename, code)

        # Execute the code
        if terminal:
            result = await terminal.execute(f"python {filename}")
            return f"Generated {filename} and executed.\n\nOutput:\n{result}"

        return f"Generated {filename} but could not execute (terminal unavailable)."

    async def _execute_task(self, task: str, terminal: Any) -> str:
        """Execute a specific command or script."""
        if terminal:
            result = await terminal.execute(task)
            return f"Execution result:\n{result}"
        return f"Cannot execute: {task} (terminal unavailable)"

    async def _general_task(
        self, task: str, filesystem: Any, terminal: Any, context: Any
    ) -> str:
        """Handle a general coding task."""
        # Use LLM to determine the best approach
        approach = await self._llm_call(
            system_prompt="You are a coding assistant. Describe briefly what needs to be done.",
            user_prompt=f"Task: {task}"
        )
        return approach if approach else f"Task acknowledged: {task}"

    def _needs_code_generation(self, task: str) -> bool:
        """Check if the task requires generating new code."""
        keywords = ["create", "write", "generate", "simulation", "script", "program", "build"]
        return any(kw in task.lower() for kw in keywords)

    def _needs_execution(self, task: str) -> bool:
        """Check if the task requires executing existing code."""
        keywords = ["run", "execute", "test", "debug"]
        return any(kw in task.lower() for kw in keywords)
