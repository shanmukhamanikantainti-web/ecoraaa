"""
PEGASUS OS — Software Testing Agent

Capabilities:
- Project inspection
- Test execution (unit, integration, system)
- Failure analysis
- Log reading
- Error reproduction
- Fix suggestion and implementation
- Regression testing
- Report generation

Desktop integration:
- Opens Terminal for test execution
- Opens Code Editor for fix implementation
- Opens Browser for documentation lookup
"""

import logging
from typing import Any

from .base import BaseAgent

logger = logging.getLogger("pegasus.agents.testing")


class TestingAgent(BaseAgent):
    """
    Testing Agent specializes in running tests, analyzing failures,
    and suggesting or implementing fixes using iterative tool loop.
    """

    def __init__(self):
        super().__init__(name="Testing Agent")

    def can_handle(self, task_description: str) -> bool:
        """Testing agent handles test, debug, verify, check tasks."""
        keywords = [
            "test", "testing", "verify", "validate", "check",
            "debug", "failure", "error", "log", "regression",
            "assert", "coverage", "lint", "type check", "build"
        ]
        return any(kw in task_description.lower() for kw in keywords)

    async def execute(self, step: Any, tools: dict[str, Any], context: Any) -> str:
        """Execute a testing step using the iterative tool loop."""
        task = step.name
        logger.info(f"[Testing] Executing: {task}")

        system_prompt = """You are ECORAA Testing Agent.
You specialize in running tests, analyzing failures, and suggesting fixes.
You MUST use real tools to execute tests and analyze results.
You must never say "Tests passed" unless tests actually passed.
If no test framework exists, report that honestly.
Use the iterative tool loop to: detect test framework -> run tests -> analyze failures -> suggest fixes."""

        return await self._execute_tool_loop(task, tools, system_prompt)