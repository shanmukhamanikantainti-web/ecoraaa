"""
PEGASUS OS — Planner

Decomposes high-level user goals into dynamic, context-driven executable steps.
Does NOT enforce a fixed multi-step pipeline for all goals.

The Planner now produces a SINGLE adaptive step that the agent executes.
The agent itself decides what tools to use, in what order, and how many
iterations are needed. The number of steps is NOT predetermined.
"""

import logging
import os
from typing import Any, Optional

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
        target_agent: Optional[str] = None,
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

    def _determine_agent(self, goal_lower: str, target_agent: Optional[str] = None) -> str:
        """Determine which agent should handle this goal."""
        if target_agent:
            return target_agent

        # Keyword-based agent selection
        if any(kw in goal_lower for kw in ["test", "testing", "verify", "validate", "debug"]):
            return "TESTING"
        if any(kw in goal_lower for kw in ["review", "audit", "inspect changes", "code review"]):
            return "REVIEW"
        if any(kw in goal_lower for kw in ["readme", "release notes", "changelog", "documentation", "marketing"]):
            return "MARKETING"
        if any(kw in goal_lower for kw in ["where is", "find", "search", "explain", "how does", "what is", "research", "information"]):
            return "RESEARCH"
        if any(kw in goal_lower for kw in ["code", "write", "create", "fix", "refactor", "build", "implement"]):
            return "CODING"

        # Default to General Agent for broad-purpose tasks
        return "GENERAL"

    async def _llm_plan(self, goal: str, context: Any = None) -> list[dict] | None:
        """
        Use LLM to generate a custom plan for complex goals.
        """
        try:
            from ..config.settings import settings

            if not settings.openrouter_api_key:
                return None

            import openai
            client = openai.AsyncOpenAI(
                api_key=settings.openrouter_api_key or os.getenv("OPENROUTER_API_KEY"),
                base_url=settings.openrouter_base_url
            )

            system_prompt = """You are the PEGASUS OS Planner. Decompose the user's goal into ordered steps.

Each step must be a JSON object with:
- "name": Description of what this step does
- "agent": Which agent should handle it ("GENERAL", "CODING", "RESEARCH", "TESTING", "REVIEW", "MARKETING")
- "tool": Which tool to use ("browser", "terminal", "filesystem", or null)

Return ONLY a JSON array of step objects. Keep it to 1-3 steps maximum."""

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
            agent = step.get("agent", "GENERAL")
            if agent and isinstance(agent, str):
                agent = agent.upper().replace(' AGENT', '')
                if agent not in ["GENERAL", "CODING", "RESEARCH", "TESTING", "REVIEW", "MARKETING"]:
                    agent = "GENERAL"
            else:
                agent = "GENERAL"
            tool = step.get("tool")
            processed.append({
                "name": name,
                "agent": agent,
                "tool": tool,
            })
        return processed
