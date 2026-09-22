"""
PEGASUS OS — Marketing Agent

Capabilities:
- Market data monitoring
- News and trend analysis
- Data correlation
- Report generation
- Alert detection
- Historical analysis

Desktop integration:
- Opens Browser for market data
- Opens Terminal for data processing
- Opens Files for report storage

Note: Any financial functionality must be clearly presented as
analysis/information rather than guaranteed financial advice.
"""

import logging
from typing import Any

from .base import BaseAgent

logger = logging.getLogger("pegasus.agents.market")


class MarketAnalysisAgent(BaseAgent):
    """
    Marketing Agent specializes in documentation, README, release notes,
    and market/product content using iterative tool loop.
    """

    def __init__(self):
        super().__init__(name="Marketing Agent")

    def can_handle(self, task_description: str) -> bool:
        """Marketing agent handles readme, docs, release notes, marketing, and analysis tasks."""
        keywords = [
            "marketing", "readme", "documentation", "release notes", "changelog",
            "market", "trend", "analysis", "report", "stock",
            "price", "competitor", "industry", "forecast",
            "revenue", "growth", "investment", "financial"
        ]
        return any(kw in task_description.lower() for kw in keywords)

    async def execute(self, step: Any, tools: dict[str, Any], context: Any) -> str:
        """Execute a marketing/documentation step using the iterative tool loop."""
        task = step.name
        logger.info(f"[Marketing] Executing: {task}")

        system_prompt = """You are ECORAA Marketing Agent.
You create documentation, README files, release notes, and marketing content.
You must inspect the actual project (filesystem, git) to understand the project.
You MUST NOT invent features, integrations, statistics, or capabilities.
Use verified project information only.
Use the iterative tool loop to gather context, then create accurate content."""

        return await self._execute_tool_loop(task, tools, system_prompt)