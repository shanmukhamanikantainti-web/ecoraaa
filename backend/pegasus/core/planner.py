"""
PEGASUS OS — Planner

Decomposes high-level user goals into executable task steps.
Uses LLM for intelligent goal decomposition.
"""

import logging
from typing import Any

logger = logging.getLogger("pegasus.planner")

# Fallback plan templates for common goals
PLAN_TEMPLATES = {
    "demo": [
        {"name": "Inspect source code and identify bug in calculator", "agent": "Coding Agent", "tool": "filesystem"},
        {"name": "Implement bug fix in calculator module", "agent": "Coding Agent", "tool": "filesystem"},
        {"name": "Execute test suite to validate fix", "agent": "Testing Agent", "tool": "terminal"},
        {"name": "Review code changes, security, and coverage", "agent": "Review Agent", "tool": "terminal"},
    ],
    "review": [
        {"name": "Inspect git diff and code changes", "agent": "Review Agent", "tool": "terminal"},
        {"name": "Perform security and quality audit", "agent": "Review Agent", "tool": "filesystem"},
    ],
    "marketing": [
        {"name": "Inspect project changes and features", "agent": "Marketing Agent", "tool": "filesystem"},
        {"name": "Generate README and release notes", "agent": "Marketing Agent", "tool": "filesystem"},
    ],
    "code": [
        {"name": "Inspect project structure", "agent": "Coding Agent", "tool": "filesystem"},
        {"name": "Implement requested code changes", "agent": "Coding Agent", "tool": "filesystem"},
        {"name": "Validate execution", "agent": "Coding Agent", "tool": "terminal"},
    ],
    "test": [
        {"name": "Inspect test suite structure", "agent": "Testing Agent", "tool": "filesystem"},
        {"name": "Run unit and integration tests", "agent": "Testing Agent", "tool": "terminal"},
        {"name": "Analyze failure report", "agent": "Testing Agent", "tool": "terminal"},
    ],
    "default": [
        {"name": "Inspect project workspace", "agent": "Coding Agent", "tool": "filesystem"},
        {"name": "Execute requested modifications", "agent": "Coding Agent", "tool": "filesystem"},
        {"name": "Run tests and verify", "agent": "Testing Agent", "tool": "terminal"},
        {"name": "Review changes", "agent": "Review Agent", "tool": "terminal"},
    ],
}


class Planner:
    """
    Decomposes user goals into executable steps.
    Uses LLM-based planning when available, falls back to template plans.
    """

    async def decompose_goal(self, goal: str, context: Any = None, target_agent: str = None) -> list[dict]:
        """
        Decompose a high-level goal into ordered steps.
        Each step has: name, agent (optional), tool (optional).
        If target_agent is specified, all steps are assigned to target_agent unless it is a multi-agent workflow.
        """
        goal_lower = goal.lower()

        import copy

        # If an explicit target_agent is selected by user mode
        if target_agent == "Coding Agent":
            plan = [
                {"name": f"Inspect workspace for task: {goal}", "agent": "Coding Agent", "tool": "filesystem"},
                {"name": f"Perform requested development changes: {goal}", "agent": "Coding Agent", "tool": "filesystem"},
                {"name": "Verify execution and output", "agent": "Coding Agent", "tool": "terminal"}
            ]
            logger.info(f"Planner: Mode override -> Routing goal directly to Coding Agent")
            return plan
        elif target_agent == "Testing Agent":
            plan = [
                {"name": f"Inspect workspace and detect test suite: {goal}", "agent": "Testing Agent", "tool": "filesystem"},
                {"name": f"Run real test suite and analyze results", "agent": "Testing Agent", "tool": "terminal"}
            ]
            logger.info(f"Planner: Mode override -> Routing goal directly to Testing Agent")
            return plan
        elif target_agent == "Review Agent":
            plan = [
                {"name": f"Inspect git diff and workspace status for review: {goal}", "agent": "Review Agent", "tool": "terminal"},
                {"name": "Perform code, security, and architecture review", "agent": "Review Agent", "tool": "filesystem"}
            ]
            logger.info(f"Planner: Mode override -> Routing goal directly to Review Agent")
            return plan
        elif target_agent == "Marketing Agent":
            plan = [
                {"name": f"Inspect project for documentation/marketing task: {goal}", "agent": "Marketing Agent", "tool": "filesystem"},
                {"name": f"Generate documentation and release notes", "agent": "Marketing Agent", "tool": "filesystem"}
            ]
            logger.info(f"Planner: Mode override -> Routing goal directly to Marketing Agent")
            return plan

        # Try template matching first
        if "calculator" in goal_lower or ("fix" in goal_lower and "test" in goal_lower and "review" in goal_lower):
            plan = copy.deepcopy(PLAN_TEMPLATES["demo"])
        elif any(kw in goal_lower for kw in ["review", "audit", "inspect"]):
            plan = copy.deepcopy(PLAN_TEMPLATES["review"])
        elif any(kw in goal_lower for kw in ["readme", "release notes", "marketing", "changelog", "doc"]):
            plan = copy.deepcopy(PLAN_TEMPLATES["marketing"])
        elif any(kw in goal_lower for kw in ["test", "testing", "verify", "unittest", "pytest"]):
            plan = copy.deepcopy(PLAN_TEMPLATES["test"])
        elif any(kw in goal_lower for kw in ["code", "write", "create", "fix", "refactor"]):
            plan = copy.deepcopy(PLAN_TEMPLATES["code"])
        else:
            plan = copy.deepcopy(PLAN_TEMPLATES["default"])

        # Attempt LLM-enhanced planning
        llm_plan = await self._llm_plan(goal, context)
        if llm_plan:
            return llm_plan

        # Add the user's goal as context to the first step
        if plan:
            plan[0]["name"] = f"Understand: {goal}"

        logger.info(f"Planner: Generated {len(plan)} steps for goal")
        return plan

    async def _llm_plan(self, goal: str, context: Any = None) -> list[dict] | None:
        """Use LLM to generate a custom plan for complex goals."""
        try:
            from ..config.settings import settings

            if not settings.openai_api_key:
                return None

            import openai
            client = openai.AsyncOpenAI(api_key=settings.openai_api_key)

            system_prompt = """You are the PEGASUS OS Planner. Decompose the user's goal into ordered steps.

Each step must be a JSON object with:
- "name": Description of what this step does
- "agent": Which agent should handle it ("Research Agent", "Coding Agent", "Device Agent", or null)
- "tool": Which tool to use ("browser", "terminal", "filesystem", or null)

Return ONLY a JSON array of step objects. Keep it to 3-7 steps maximum.
Focus on practical, executable actions that follow the PEGASUS workflow:
USER GOAL → UNDERSTAND → PLAN → PERMISSION → EXECUTE → OBSERVE → ADAPT → RESULT → MEMORY

After each EXECUTE step, include an OBSERVE step to verify results."""

            response = await client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Goal: {goal}"}
                ],
                temperature=0.3,
                max_tokens=500
            )

            import json
            content = response.choices[0].message.content
            steps = json.loads(content)

            if isinstance(steps, list) and len(steps) > 0:
                logger.info(f"LLM Planner: Generated {len(steps)} steps")
                # Post-process: ensure each step follows PEGASUS workflow
                steps = self._post_process_plan(steps)
                return steps

        except Exception as e:
            logger.warning(f"LLM planning failed: {e}")

        return None

    @staticmethod
    def _post_process_plan(steps: list[dict]) -> list[dict]:
        """Ensure plan follows PEGASUS workflow pattern."""
        processed = []
        for i, step in enumerate(steps):
            # Ensure every step has name, agent, and tool
            name = step.get("name", f"Step {i+1}")
            agent = step.get("agent") or ("Coding Agent" if i % 2 == 0 else "Research Agent")
            tool = step.get("tool") or ("terminal" if i % 3 == 0 else "browser")
            processed.append({
                "name": name,
                "agent": agent,
                "tool": tool
            })
        return processed
