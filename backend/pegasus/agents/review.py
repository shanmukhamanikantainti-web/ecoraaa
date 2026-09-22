"""
PEGASUS OS — Review Agent

The Review Agent is an independent code and architecture reviewer.
Capabilities:
- Inspect code changes & diffs
- Identify bugs, security vulnerabilities, and architectural smells
- Evaluate test coverage and maintainability
- Generate detailed review reports WITHOUT silently modifying source code
"""

import logging
from typing import Any

from .base import BaseAgent

logger = logging.getLogger("pegasus.agents.review")


class ReviewAgent(BaseAgent):
    """
    Review Agent performs independent code and security reviews against the active workspace.
    Uses iterative tool loop for inspection.
    """

    def __init__(self):
        super().__init__(name="Review Agent")

    def can_handle(self, task_description: str) -> bool:
        """Review agent handles review, inspect, security, audit, check changes tasks."""
        keywords = [
            "review", "inspect", "audit", "security", "vulnerability",
            "quality", "architecture", "diff", "code review", "checker"
        ]
        return any(kw in task_description.lower() for kw in keywords)

    async def execute(self, step: Any, tools: dict[str, Any], context: Any) -> str:
        """Execute code review using the iterative tool loop (read-only)."""
        task = step.name
        logger.info(f"[Review] Executing: {task}")

        system_prompt = """You are ECORAA Review Agent.
You are an independent code and security reviewer.
You must inspect the actual project files, Git diff, and code changes.
You MUST use real tools (filesystem, terminal) to gather evidence.
Your findings should contain: severity, file, line (if available), title, description, recommendation.
DEFAULT BEHAVIOR IS READ-ONLY. Do not silently modify source code.
Report evidence-based findings."""

        return await self._execute_tool_loop(task, tools, system_prompt)