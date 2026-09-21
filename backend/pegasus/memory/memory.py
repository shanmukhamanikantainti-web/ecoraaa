"""
PEGASUS OS — Memory System v2.0

Persistent AI memory with categories:
- Personal: preferences, workflows, tools
- Project: architecture, dependencies, known problems, important files
- Session: previous actions, results, screenshots, recordings
- Knowledge: research, documentation, findings
"""

import json
import time
import uuid
from dataclasses import dataclass, field, asdict
from enum import Enum
from typing import Any, Optional, List
import logging

logger = logging.getLogger("pegasus.memory")


class MemoryCategory(str, Enum):
    PERSONAL = "personal"
    PROJECT = "project"
    SESSION = "session"
    KNOWLEDGE = "knowledge"


class MemoryAccessLevel(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    RESTRICTED = "restricted"


@dataclass
class MemoryEntry:
    id: str
    category: MemoryCategory
    title: str
    content: str
    metadata: dict[str, Any] = field(default_factory=dict)
    access_level: MemoryAccessLevel = MemoryAccessLevel.PRIVATE
    pinned: bool = False
    created_at: float = field(default_factory=time.time)
    updated_at: float = field(default_factory=time.time)
    expires_at: Optional[float] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "category": self.category.value,
            "title": self.title,
            "content": self.content,
            "metadata": self.metadata,
            "access_level": self.access_level.value,
            "pinned": self.pinned,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "expires_at": self.expires_at,
        }


class MemoryManager:
    """
    Persistent AI memory system for PEGASUS.
    Stores and retrieves contextual information across sessions.
    """

    def __init__(self):
        self.memory: dict[str, MemoryEntry] = {}
        self._load_default_entries()

    def _load_default_entries(self):
        """Initialize with default memory entries."""
        self.store(MemoryEntry(
            id=str(uuid.uuid4())[:8],
            category=MemoryCategory.PERSONAL,
            title="User Role",
            content="Engineering student working on PEGASUS OS development",
            metadata={"type": "user_info"},
            access_level=MemoryAccessLevel.PUBLIC
        ))

    def store(self, entry: MemoryEntry) -> str:
        """Store a memory entry."""
        self.memory[entry.id] = entry
        logger.info(f"Memory stored: {entry.title} [{entry.category.value}]")
        return entry.id

    def retrieve(self, query: str, category: Optional[MemoryCategory] = None,
                 limit: int = 10) -> list[MemoryEntry]:
        """Retrieve memory entries matching a query."""
        results = []
        for entry in self.memory.values():
            if category and entry.category != category:
                continue
            if self._is_relevant(entry, query):
                results.append(entry)
        # Sort by pinned first, then by updated_at
        results.sort(key=lambda e: (not e.pinned, -e.updated_at))
        return results[:limit]

    def _is_relevant(self, entry: MemoryEntry, query: str) -> bool:
        """Check if a memory entry is relevant to a query."""
        query_lower = query.lower()
        return (query_lower in entry.title.lower() or
                query_lower in entry.content.lower() or
                any(query_lower in str(v).lower() for v in entry.metadata.values()))

    def get_by_category(self, category: MemoryCategory) -> list[MemoryEntry]:
        """Get all entries in a category."""
        return [e for e in self.memory.values() if e.category == category]

    def pin(self, entry_id: str) -> bool:
        """Pin a memory entry."""
        if entry_id in self.memory:
            self.memory[entry_id].pinned = True
            self.memory[entry_id].updated_at = time.time()
            return True
        return False

    def unpin(self, entry_id: str) -> bool:
        """Unpin a memory entry."""
        if entry_id in self.memory:
            self.memory[entry_id].pinned = False
            self.memory[entry_id].updated_at = time.time()
            return True
        return False

    def delete(self, entry_id: str) -> bool:
        """Delete a memory entry."""
        if entry_id in self.memory:
            del self.memory[entry_id]
            logger.info(f"Memory deleted: {entry_id}")
            return True
        return False

    def update(self, entry_id: str, **kwargs) -> bool:
        """Update a memory entry."""
        if entry_id not in self.memory:
            return False
        entry = self.memory[entry_id]
        for key, value in kwargs.items():
            if hasattr(entry, key):
                setattr(entry, key, value)
        entry.updated_at = time.time()
        return True

    def get_all(self) -> list[dict]:
        """Get all memory entries as dicts."""
        return [e.to_dict() for e in self.memory.values()]

    def get_summary(self) -> str:
        """Get memory summary for context."""
        categories = {}
        for entry in self.memory.values():
            cat = entry.category.value
            categories.setdefault(cat, 0)
            categories[cat] += 1
        return f"Memory: {len(self.memory)} entries across {len(categories)} categories"
