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
    and suggesting or implementing fixes.
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
        """Execute a testing step."""
        task = step.name
        logger.info(f"[Testing] Executing: {task}")

        terminal = self._use_tool(tools, "terminal")
        filesystem = self._use_tool(tools, "filesystem")
        browser = self._use_tool(tools, "browser")

        # Determine the type of testing task
        if self._is_test_execution(task):
            return await self._run_tests(task, terminal, context)
        elif self._is_failure_analysis(task):
            return await self._analyze_failure(task, terminal, filesystem, browser, context)
        elif self._is_fix_task(task):
            return await self._apply_fix(task, terminal, filesystem, context)
        else:
            return await self._general_testing(task, terminal, context)

    async def _run_tests(self, task: str, terminal: Any, context: Any) -> str:
        """Run tests and collect results."""
        if not terminal:
            return "Cannot run tests: terminal unavailable"

        # Try common test runners
        test_commands = [
            "python -m pytest --tb=short -q",
            "python -m unittest discover -s tests",
            "npm test",
            "cargo test",
        ]

        for cmd in test_commands:
            result = await terminal.execute(cmd, timeout=120)
            if result and "not found" not in result.lower() and "error" not in result.lower()[:50]:
                return f"Test execution result:\n{result}"

        return f"No test runner found for project. Task: {task}"

    async def _analyze_failure(
        self, task: str, terminal: Any, filesystem: Any, browser: Any, context: Any
    ) -> str:
        """Analyze test failures and identify root causes."""
        # First, try to get more details about the failure
        if terminal:
            # Run tests with verbose output
            result = await terminal.execute(
                "python -m pytest --tb=long -v 2>&1 | tail -50",
                timeout=60
            )

            if result:
                # Use LLM to analyze the failure
                system_prompt = """You are ECORAA Testing Agent.
Inspect the actual project.
Run actual tests.
Report actual commands and results.
Never fabricate successful tests."""

                analysis = await self._llm_call(
                    system_prompt=system_prompt,
                    user_prompt=f"Test failure analysis:\n{result[:2000]}"
                )
                return f"Failure Analysis:\n{analysis}"

        return f"Could not analyze failure for: {task}"

    async def _apply_fix(self, task: str, terminal: Any, filesystem: Any, context: Any) -> str:
        """Apply a fix based on analysis."""
        # Use LLM to generate the fix
        fix = await self._llm_call(
            system_prompt="""You are a Python developer.
Generate the minimal code fix for the described issue.
Return ONLY the code change, not a full explanation.
Use clear, working Python code.""",
            user_prompt=f"Task: {task}"
        )

        if fix and not fix.startswith("LLM unavailable"):
            return f"Proposed fix:\n{fix}"

        return f"Could not generate fix for: {task}"

    async def _general_testing(self, task: str, terminal: Any, context: Any) -> str:
        """Handle a general testing task."""
        if terminal:
            result = await terminal.execute(f"python -m pytest --tb=short -q 2>&1 | tail -20", timeout=60)
            return f"Test results:\n{result}"

        return f"Testing task acknowledged: {task}"

    def _is_test_execution(self, task: str) -> bool:
        keywords = ["run test", "execute test", "run tests", "test suite", "test all"]
        return any(kw in task.lower() for kw in keywords)

    def _is_failure_analysis(self, task: str) -> bool:
        keywords = ["analyze failure", "why fail", "error analysis", "diagnose", "investigate"]
        return any(kw in task.lower() for kw in keywords)

    def _is_fix_task(self, task: str) -> bool:
        keywords = ["fix", "repair", "correct", "resolve", "patch"]
        return any(kw in task.lower() for kw in keywords)
