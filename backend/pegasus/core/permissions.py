"""
PEGASUS OS — Permission Manager

Enforces least-privilege permissions for agents and tools.
Agents shall not receive unrestricted access by default.

Permission flow: User → Agent → Tool → Permission Check → Execution
"""

import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional

logger = logging.getLogger("pegasus.permissions")


class PermissionLevel(str, Enum):
    DENIED = "DENIED"
    READ_ONLY = "READ_ONLY"
    STANDARD = "STANDARD"
    ELEVATED = "ELEVATED"
    FULL = "FULL"


@dataclass
class ToolPermission:
    """Permission grant for a specific tool."""
    tool_name: str
    level: PermissionLevel = PermissionLevel.STANDARD
    requires_confirmation: bool = False
    max_operations: Optional[int] = None
    allowed_paths: list[str] = field(default_factory=list)
    denied_paths: list[str] = field(default_factory=list)


@dataclass
class AgentPermissions:
    """Permissions assigned to an agent."""
    agent_name: str
    tools: dict[str, ToolPermission] = field(default_factory=dict)
    can_access_network: bool = True
    can_access_files: bool = True
    can_execute_code: bool = False
    can_access_camera: bool = False
    can_access_microphone: bool = False
    max_runtime_seconds: int = 300


class PermissionManager:
    """
    Manages and enforces permissions for agents and tools.
    Follows least-privilege principle.
    """

    def __init__(self):
        self.agent_permissions: dict[str, AgentPermissions] = {}
        self._setup_default_permissions()

    def _setup_default_permissions(self):
        """Set up default permission profiles for each agent type."""
        # Research Agent — network and file read access
        self.agent_permissions["Research Agent"] = AgentPermissions(
            agent_name="Research Agent",
            tools={
                "browser": ToolPermission("browser", PermissionLevel.STANDARD),
                "filesystem": ToolPermission("filesystem", PermissionLevel.READ_ONLY),
            },
            can_access_network=True,
            can_access_files=True,
            can_execute_code=False,
        )

        # Coding Agent — file write and terminal access
        self.agent_permissions["Coding Agent"] = AgentPermissions(
            agent_name="Coding Agent",
            tools={
                "filesystem": ToolPermission("filesystem", PermissionLevel.STANDARD),
                "terminal": ToolPermission("terminal", PermissionLevel.STANDARD, requires_confirmation=True),
                "browser": ToolPermission("browser", PermissionLevel.READ_ONLY),
            },
            can_access_network=True,
            can_access_files=True,
            can_execute_code=True,
        )

        # Device Agent — device-level access
        self.agent_permissions["Device Agent"] = AgentPermissions(
            agent_name="Device Agent",
            tools={
                "android": ToolPermission("android", PermissionLevel.STANDARD),
                "filesystem": ToolPermission("filesystem", PermissionLevel.READ_ONLY),
            },
            can_access_network=False,
            can_access_files=True,
        )

        # Monitoring Agent — read-only network access
        self.agent_permissions["Monitoring Agent"] = AgentPermissions(
            agent_name="Monitoring Agent",
            tools={
                "browser": ToolPermission("browser", PermissionLevel.READ_ONLY),
            },
            can_access_network=True,
            can_access_files=False,
        )

    def check_permission(self, agent_name: str, tool_name: str, operation: str = "standard") -> bool:
        """
        Check if an agent has permission to use a tool.
        Returns True if allowed, False if denied.
        """
        if agent_name not in self.agent_permissions:
            logger.warning(f"No permissions defined for agent: {agent_name}")
            return False

        agent_perms = self.agent_permissions[agent_name]

        if tool_name not in agent_perms.tools:
            logger.warning(f"Agent '{agent_name}' has no permission for tool '{tool_name}'")
            return False

        tool_perm = agent_perms.tools[tool_name]

        if tool_perm.level == PermissionLevel.DENIED:
            return False

        if tool_perm.level == PermissionLevel.READ_ONLY and operation not in ("read", "list", "search", "get"):
            logger.warning(f"Agent '{agent_name}' has read-only access to '{tool_name}', cannot '{operation}'")
            return False

        return True

    def requires_confirmation(self, agent_name: str, tool_name: str) -> bool:
        """Check if an operation requires user confirmation."""
        if agent_name in self.agent_permissions:
            agent_perms = self.agent_permissions[agent_name]
            if tool_name in agent_perms.tools:
                return agent_perms.tools[tool_name].requires_confirmation
        return True  # Default: require confirmation

    def get_agent_permissions(self, agent_name: str) -> Optional[AgentPermissions]:
        """Get permissions for an agent."""
        return self.agent_permissions.get(agent_name)

    def grant_permission(self, agent_name: str, tool_name: str, level: PermissionLevel):
        """Grant or update a permission."""
        if agent_name not in self.agent_permissions:
            self.agent_permissions[agent_name] = AgentPermissions(agent_name=agent_name)

        self.agent_permissions[agent_name].tools[tool_name] = ToolPermission(
            tool_name=tool_name,
            level=level
        )
        logger.info(f"Permission granted: {agent_name} → {tool_name} [{level.value}]")

    def revoke_permission(self, agent_name: str, tool_name: str):
        """Revoke a permission."""
        if agent_name in self.agent_permissions:
            self.agent_permissions[agent_name].tools.pop(tool_name, None)
            logger.info(f"Permission revoked: {agent_name} → {tool_name}")
