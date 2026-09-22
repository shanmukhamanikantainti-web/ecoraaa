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

    def _extract_research_topic(self, task: str) -> str:
        """Extract the actual research topic from the task description."""
        # Remove common prefixes
        prefixes = [
            "execute task: ",
            "execute task:",
            "research: ",
            "research:",
            "search: ",
            "search:",
            "find: ",
            "find:",
            "look up: ",
            "look up:",
        ]
        task_lower = task.lower().strip()
        for prefix in prefixes:
            if task_lower.startswith(prefix):
                task = task[len(prefix):].strip()
                break

        # Remove "do a research on" or similar
        research_phrases = [
            "do a research on",
            "research on",
            "research about",
            "investigate",
            "analyze",
        ]
        task_lower = task.lower()
        for phrase in research_phrases:
            if phrase in task_lower:
                idx = task_lower.index(phrase)
                task = task[idx + len(phrase):].strip()
                break

        return task

    async def execute(self, step: Any, tools: dict[str, Any], context: Any) -> str:
        """Execute a research step."""
        task = step.name
        logger.info(f"[Research] Executing: {task}")

        # Step 1: Extract the actual research topic
        research_topic = self._extract_research_topic(task)
        logger.info(f"[Research] Extracted topic: '{research_topic}'")

        # Step 2: Search for sources using web search
        browser = self._use_tool(tools, "browser")
        sources = []

        if browser:
            search_results = await browser.search(research_topic)
            sources = search_results.get("results", [])
            logger.info(f"[Research] Found {len(sources)} web sources")

        # Step 3: Extract information from top sources
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
                            "content": content[:5000],  # Keep first 5000 chars
                        })
                except Exception as e:
                    logger.warning(f"[Research] Failed to extract: {e}")

        # Step 4: Summarize and compare
        summary = await self._summarize(research_topic, extracted_info)

        # Step 5: Save if filesystem is available
        filesystem = self._use_tool(tools, "filesystem")
        if filesystem:
            await filesystem.write_file(
                f"research_{research_topic[:30].replace(' ', '_').replace('/', '_')}.md",
                summary
            )

        return summary

    async def _summarize(self, topic: str, sources: list[dict]) -> str:
        """Generate a research summary from collected sources."""
        if not sources:
            return f"No web sources found for: {topic}. The research tool is available but no results were returned."

        # Build source text for LLM
        source_text = "\n".join([
            f"- {s.get('title', 'Untitled')} ({s.get('url', 'No URL')}): {s.get('snippet', 'No snippet')[:300]}"
            for s in sources
        ])

        prompt = f"""Research topic: {topic}

Sources found:
{source_text}

Provide a concise, well-structured research summary.
Include key findings, comparisons where applicable, and cite sources.
If information is uncertain, explicitly state so.
Format as a clear report with sections."""

        summary = await self._llm_call(
            system_prompt="You are a research assistant. Provide accurate, concise research summaries with source citations. Do not fabricate information.",
            user_prompt=prompt
        )

        return summary if summary else f"Could not generate summary for: {topic}"