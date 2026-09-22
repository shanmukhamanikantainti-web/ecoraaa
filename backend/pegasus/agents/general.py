"""
PEGASUS OS — General Agent

Capabilities:
- Intent understanding
- General development assistance
- Intent-driven capability delegation
- Broad-purpose contextual assistance
"""

import logging
from typing import Any
from .base import BaseAgent

logger = logging.getLogger("pegasus.agents.general")


class GeneralAgent(BaseAgent):
    """
    General Agent is the broad-purpose assistant.
    Understands intent, answers broad questions, inspects context,
    and coordinates other tools/specialists dynamically.
    """

    def __init__(self):
        super().__init__(name="General Agent")

    def can_handle(self, task_description: str) -> bool:
        """General agent acts as universal default."""
        return True

    async def execute(self, step: Any, tools: dict[str, Any], context: Any) -> str:
        """Execute a general query or assistant task."""
        task = step.name
        logger.info(f"[General] Executing: {task}")

        task_lower = task.lower().strip()
        conversational_triggers = ["hi", "hello", "hey", "how are you", "greetings", "good morning", "good afternoon", "good evening", "thanks", "thank you", "sup"]
        is_conversational = any(trigger in task_lower for trigger in conversational_triggers) or len(task_lower) < 25

        if is_conversational:
            system_prompt = "You are ECORAA General Agent, a helpful, polite, and friendly AI operating system assistant. Respond warmly and conversationally to the user."
            user_prompt = f"User message: {task}"
            return await self._llm_call(system_prompt=system_prompt, user_prompt=user_prompt)

        filesystem = self._use_tool(tools, "filesystem")
        terminal = self._use_tool(tools, "terminal")
        browser = self._use_tool(tools, "browser")

        # Inspect workspace context if helpful
        file_summary = ""
        if filesystem:
            try:
                files = await filesystem.list_directory(".")
                file_names = [f["name"] for f in files[:20]]
                file_summary = f"Workspace root files: {', '.join(file_names)}"
            except Exception:
                pass

        # Get git status if available
        git_summary = ""
        if terminal:
            try:
                git_status = await terminal.execute("git status --short 2>/dev/null || echo 'No git repo'")
                if git_status and len(git_status) < 500:
                    git_summary = f"Git status: {git_status}"
            except Exception:
                pass

        system_prompt = """You are ECORAA General Agent, an AI operating system assistant.
Answer general questions, explain project behavior, assist with development decisions,
and provide clear, structured, evidence-based guidance.
If a specialized capability (Coding, Testing, Review, Research, Marketing) is required, recommend or describe it clearly.
Do not fabricate information. Use only verified context."""

        user_prompt = f"""Task / Goal: {task}
{file_summary}
{git_summary}

Provide a helpful, precise response. If you need more information, state what you need.
If the task requires a specialized agent, explain which one and why."""

        response = await self._llm_call(
            system_prompt=system_prompt,
            user_prompt=user_prompt
        )

        return response if response else f"General Agent processed request: {task}"