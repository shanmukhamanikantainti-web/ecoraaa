"""
PEGASUS OS — Context Manager

Maintains relevant contextual information including:
- Current application
- Current workspace
- Active task
- Recent actions
- Project context
- Relevant memory
"""

import time
from dataclasses import dataclass, field
from typing import Any, Optional


@dataclass
class ContextSnapshot:
    """Point-in-time snapshot of the system context."""
    timestamp: float = field(default_factory=time.time)
    current_app: Optional[str] = None
    current_workspace: str = "HOME"
    active_task: Optional[str] = None
    recent_actions: list[str] = field(default_factory=list)
    project_context: Optional[str] = None
    relevant_memory: list[str] = field(default_factory=list)


class ContextManager:
    """
    Manages the current system context.
    Used by the planner and agents to understand the current state.
    """

    def __init__(self):
        self.current_workspace: str = "HOME"
        self.current_app: Optional[str] = None
        self.active_task: Optional[str] = None
        self.recent_actions: list[dict] = []
        self.project_context: Optional[str] = None
        self.user_info: dict[str, Any] = {}

    def update(self, **kwargs):
        """Update context fields."""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)

    def add_action(self, action: str, details: Optional[str] = None):
        """Record a recent action."""
        self.recent_actions.append({
            "action": action,
            "details": details,
            "timestamp": time.time()
        })
        # Keep only last 50 actions
        if len(self.recent_actions) > 50:
            self.recent_actions = self.recent_actions[-50:]

    def set_workspace(self, workspace: str):
        """Switch to a workspace."""
        self.current_workspace = workspace
        self.add_action("workspace_switch", workspace)

    def set_active_task(self, task: Optional[str]):
        """Set the current active task."""
        self.active_task = task

    def get_snapshot(self) -> ContextSnapshot:
        """Get a snapshot of the current context."""
        return ContextSnapshot(
            current_app=self.current_app,
            current_workspace=self.current_workspace,
            active_task=self.active_task,
            recent_actions=[a["action"] for a in self.recent_actions[-10:]],
            project_context=self.project_context,
        )

    def get_summary(self) -> str:
        """Get a text summary of the current context for LLM prompts."""
        parts = [f"Workspace: {self.current_workspace}"]
        if self.active_task:
            parts.append(f"Active task: {self.active_task}")
        if self.project_context:
            parts.append(f"Project: {self.project_context}")
        if self.recent_actions:
            recent = [a["action"] for a in self.recent_actions[-3:]]
            parts.append(f"Recent: {', '.join(recent)}")
        return " | ".join(parts)
