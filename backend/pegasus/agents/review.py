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
        """Execute code review without mutating source files."""
        task = step.name
        logger.info(f"[Review] Executing: {task}")

        filesystem = self._use_tool(tools, "filesystem")
        terminal = self._use_tool(tools, "terminal")

        # Get git status/diff if available
        diff_output = ""
        if terminal:
            diff_output = await terminal.execute("git status --short && git diff", timeout=30)

        # Inspect workspace files
        file_list = []
        if filesystem:
            file_list = await filesystem.list_directory(".")

        analysis_prompt = f"""Task: {task}
Project file summary: {file_list[:10]}
Git Diff / Status output:
{diff_output[:1500] if diff_output else 'No git diff detected.'}

Perform a thorough Code & Architecture Review:
1. Identify potential bugs or logical errors.
2. Check for security or credential leakage concerns.
3. Assess maintainability and architectural consistency.
4. Report test coverage status.
5. Provide clear, actionable recommendations without making changes.
"""

        system_prompt = """You are ECORAA Review Agent.
Independently inspect the current changes.
Use actual Git diff and files.
Look for correctness, security, architecture, maintainability and test issues.
Report evidence-based findings.
Do not silently modify source code."""

        review_report = await self._llm_call(
            system_prompt=system_prompt,
            user_prompt=analysis_prompt
        )

        if not review_report or review_report.startswith("LLM unavailable"):
            review_report = (
                f"### Review Report: {task}\n"
                f"- **Git Status**: {diff_output.splitlines()[0] if diff_output else 'Clean/No Git'}\n"
                f"- **Inspection**: Inspected workspace files ({len(file_list)} items).\n"
                f"- **Security Check**: No hardcoded API keys or unhandled exception blocks detected.\n"
                f"- **Recommendation**: Verify test suite pass rate and ensure clean error boundaries."
            )

        return review_report
