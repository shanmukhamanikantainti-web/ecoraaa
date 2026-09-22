"""
PEGASUS OS — Planner

Decomposes high-level user goals into dynamic, context-driven executable steps.
Does NOT enforce a fixed multi-step pipeline for all goals.

The Planner now produces a SINGLE adaptive step that the agent executes.
The agent itself decides what tools to use, in what order, and how many
iterations are needed. The number of steps is NOT predetermined.
"""

import logging
from typing import Any

logger = logging.getLogger("pegasus.planner")


class Planner:
    """
    Decomposes user goals into dynamic, context-driven executable steps.

    The planner no longer hardcodes:
      Coding Agent → Testing Agent → Review Agent

    Instead it produces a single adaptive step per goal. The agent
    dynamically decides what tools to use based on the actual context.
    """

    async def decompose_goal(
        self,
        goal: str,
        context: Any = None,
        target_agent: str = None,
    ) -> list[dict]:
        """
        Decompose a high-level goal into dynamic, context-driven executable steps.

        Returns a list with a SINGLE adaptive step. The agent will dynamically
        decide what tools to use, in what order, and how many iterations are needed.
        """
        goal_lower = goal.lower().strip()

        # Determine the agent type based on target_agent or goal keywords
        agent_type = self._determine_agent(goal_lower, target_agent)

        # Build a single adaptive step
        step_name = f"Execute task: {goal}"
        return [
            {
                "name": step_name,
                "agent": agent_type,
                "tool": None,  # Agent decides dynamically
            }
        ]

    def _determine_agent(self, goal_lower: str, target_agent: str = None) -> str:
        """Determine which agent should handle this goal."""
        if target_agent:
            return target_agent

        # Keyword-based agent selection
        if any(kw in goal_lower for kw in ["test", "testing", "verify", "validate", "debug"]):
            return "Testing Agent"
        if any(kw in goal_lower for kw in ["review", "audit", "inspect changes", "code review"]):
            return "Review Agent"
        if any(kw in goal_lower for kw in ["readme", "release notes", "changelog", "documentation", "marketing"]):
            return "Marketing Agent"
        if any(kw in goal_lower for kw in ["where is", "find", "search", "explain", "how does", "what is", "research"]):
            return "Research Agent"
        if any(kw in goal_lower for kw in ["code", "write", "create", "fix", "refactor", "build", "implement"]):
            return "Coding Agent"

        # Default to Coding Agent for general tasks
        return "Coding Agent"

    async def _llm_plan(self, goal: str, context: Any = None) -> list[dict] | None:
        """Use LLM to generate a custom plan for complex goals."""
        try:
            from ..config.settings import settings

            if not settings.openrouter_api_key:
                return None

            import openai
            client = openai.AsyncOpenAI(api_key=settings.openrouter_api_key)

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
                model=settings.openrouter_model,
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
            name = step.get("name", f"Step {i+1}")
            agent = step.get("agent") or ("Coding Agent" if i % 2 == 0 else "Research Agent")
            tool = step.get("tool") or ("terminal" if i % 3 == 0 else "browser")
            processed.append({
                "name": name,
                "agent": agent,
                "tool": tool,
            })
        return processed