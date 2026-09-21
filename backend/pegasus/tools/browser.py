"""
PEGASUS OS — Browser Tool

Provides web navigation, search, and page extraction capabilities.
"""

import logging
from typing import Any, Optional

logger = logging.getLogger("pegasus.tools.browser")


class BrowserTool:
    """
    Browser tool for web search, navigation, and content extraction.
    """

    def __init__(self):
        self.name = "browser"

    async def search(self, query: str) -> dict:
        """Search the web for information."""
        try:
            from duckduckgo_search import DDGS

            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=8))

            return {
                "query": query,
                "results": [
                    {
                        "title": r.get("title", ""),
                        "url": r.get("href", r.get("link", "")),
                        "snippet": r.get("body", ""),
                    }
                    for r in results
                ]
            }

        except Exception as e:
            logger.error(f"Search failed: {e}")
            return {"query": query, "results": [], "error": str(e)}

    async def extract(self, url: str) -> Optional[str]:
        """Extract readable text content from a web page."""
        try:
            import httpx
            from bs4 import BeautifulSoup

            async with httpx.AsyncClient(timeout=15) as client:
                response = await client.get(url, follow_redirects=True)
                response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            # Remove scripts and styles
            for tag in soup(["script", "style", "nav", "footer", "header"]):
                tag.decompose()

            # Get main content
            main = soup.find("main") or soup.find("article") or soup.body
            if main:
                text = main.get_text(separator="\n", strip=True)
                # Limit content length
                return text[:10000] if text else None

        except Exception as e:
            logger.warning(f"Extraction failed for {url}: {e}")

        return None

    async def navigate(self, url: str) -> dict:
        """Navigate to a URL and return page info."""
        content = await self.extract(url)
        return {
            "url": url,
            "content_length": len(content) if content else 0,
            "has_content": content is not None,
        }
