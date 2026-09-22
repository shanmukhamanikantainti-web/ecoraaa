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
    Uses the iterative tool execution loop.
    """

    def __init__(self):
        super().__init__(name="Coding Agent")

    def can_handle(self, task_description: str) -> bool:
        """Coding agent handles code, write, create, execute, run, debug tasks."""
        keywords = [
            "code", "write", "create", "generate", "execute", "run",
            "test", "debug", "fix", "simulate", "script", "program",
            "function", "class", "module", "build", "compile", "python",
            "analyze", "inspect", "bug", "issue", "problem"
        ]
        return any(kw in task_description.lower() for kw in keywords)

    async def execute(self, step: Any, tools: dict[str, Any], context: Any) -> str:
        """Execute a coding step using the iterative tool loop."""
        task = step.name
        logger.info(f"[Coding] Executing: {task}")

        system_prompt = """You are ECORAA Coding Agent.
You are a software implementation specialist.
You must iteratively interact with tools (filesystem, terminal) to achieve the goal.
Plan your steps, inspect the project structure, and verify your changes.
Do not fabricate changes.
Never claim success without actual tool-based verification.
If the user asks to "fix a bug", identify it, suggest a fix, apply it, and verify the result.
If the user asks to "generate code", write, execute, and verify it."""

        return await self._execute_tool_loop(task, tools, system_prompt)
