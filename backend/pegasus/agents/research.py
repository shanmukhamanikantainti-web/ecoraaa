"""
PEGASUS OS — Research Agent

Capabilities:
- Web search
- Source collection
- Information extraction
- Comparison
- Summarization
- Source referencing
- Research storage

Should identify uncertainty when information cannot be verified.
"""

import logging
from typing import Any

from .base import BaseAgent

logger = logging.getLogger("pegasus.agents.research")


class ResearchAgent(BaseAgent):
    """
    Research Agent specializes in finding, extracting, and synthesizing
    information from the web and other sources.
    """

    def __init__(self):
        super().__init__(name="Research Agent")

    def can_handle(self, task_description: str) -> bool:
        """Research agent handles search, research, find, compare tasks."""
        keywords = [
            "research", "search", "find", "look up", "investigate",
            "compare", "analyze", "summarize", "sources", "information",
            "discover", "explore", "review", "survey", "report"
        ]
        return any(kw in task_description.lower() for kw in keywords)

    async def execute(self, step: Any, tools: dict[str, Any], context: Any) -> str:
        """Execute a research step."""
        task = step.name
        logger.info(f"[Research] Executing: {task}")

        # Step 1: Search for sources
        browser = self._use_tool(tools, "browser")
        sources = []

        if browser:
            search_results = await browser.search(task)
            sources = search_results.get("results", [])
            logger.info(f"[Research] Found {len(sources)} sources")

        # Step 2: Extract information from top sources
        extracted_info = []
        if browser and sources:
            for source in sources[:5]:  # Limit to top 5 sources
                try:
                    content = await browser.extract(source.get("url", ""))
                    if content:
                        extracted_info.append({
                            "title": source.get("title", ""),
                            "url": source.get("url", ""),
                            "snippet": source.get("snippet", ""),
                            "content_length": len(content),
                        })
                except Exception as e:
                    logger.warning(f"[Research] Failed to extract: {e}")

        # Step 3: Summarize and compare
        summary = await self._summarize(task, extracted_info)

        # Step 4: Save if filesystem is available
        filesystem = self._use_tool(tools, "filesystem")
        if filesystem:
            await filesystem.write_file(
                f"research_{task[:30].replace(' ', '_')}.md",
                summary
            )

        return summary

    async def _summarize(self, topic: str, sources: list[dict]) -> str:
        """Generate a research summary from collected sources."""
        if not sources:
            return f"No sources found for: {topic}"

        # Use LLM to generate summary
        source_text = "\n".join([
            f"- {s.get('title', 'Untitled')}: {s.get('snippet', 'No snippet')}"
            for s in sources
        ])

        prompt = f"""Research topic: {topic}

Sources found:
{source_text}

Provide a concise, well-structured research summary.
Include key findings, comparisons where applicable, and cite sources.
If information is uncertain, explicitly state so."""

        summary = await self._llm_call(
            system_prompt="You are a research assistant. Provide accurate, concise research summaries with source citations.",
            user_prompt=prompt
        )

        return summary
