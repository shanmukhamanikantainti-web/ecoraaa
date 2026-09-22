"""
PEGASUS OS — Agent Orchestrator

The orchestrator converts a high-level user objective into executable steps.
It maintains a task state machine so every action has an observable status.

Core loop: Observe → Reason → Plan → Act → Observe → Evaluate → Repeat
"""

import asyncio
import logging
import time
import uuid
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Optional

from .planner import Planner
from .context import ContextManager
from .permissions import PermissionManager

logger = logging.getLogger("pegasus.orchestrator")


class MissionStatus(str, Enum):
    PLANNING = "PLANNING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    PAUSED = "PAUSED"


class StepStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


@dataclass
class MissionStep:
    name: str
    status: StepStatus = StepStatus.PENDING
    agent: Optional[str] = None
    tool: Optional[str] = None
    result: Optional[str] = None
    error: Optional[str] = None
    started_at: Optional[float] = None
    completed_at: Optional[float] = None

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "status": self.status.value,
            "agent": self.agent,
            "tool": self.tool,
            "result": self.result,
            "error": self.error,
        }


@dataclass
class Mission:
    id: str
    goal: str
    status: MissionStatus = MissionStatus.PLANNING
    steps: list[MissionStep] = field(default_factory=list)
    created_at: float = field(default_factory=time.time)
    completed_at: Optional[float] = None
    result: Optional[str] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "goal": self.goal,
            "status": self.status.value,
            "steps": [s.to_dict() for s in self.steps],
            "created_at": self.created_at,
        }


class PegasusOrchestrator:
    """
    Central orchestrator that manages missions, coordinates agents,
    and executes multi-step workflows.

    The orchestrator:
    1. Receives a user goal
    2. Uses the Planner to decompose it into steps
    3. Selects appropriate agents for each step
    4. Coordinates execution through the tool layer
    5. Monitors progress and handles failures
    6. Reports results back to the user
    """

    def __init__(self):
        self.planner = Planner()
        self.context = ContextManager()
        self.permissions = PermissionManager()
        self.agents: dict[str, Any] = {}
        self.agent_types: dict[Any, str] = {}  # Maps agent instance to canonical ID
        self.tools: dict[str, Any] = {}
        self.active_missions: dict[str, Mission] = {}
        self.completed_missions: list[Mission] = []
        self.event_callback = None

    def set_event_callback(self, callback):
        """Set async callback for broadcasting real-time progress events."""
        self.event_callback = callback

    async def _emit_event(self, event_type: str, data: dict):
        """Emit real-time progress event if callback registered."""
        if self.event_callback:
            try:
                await self.event_callback(event_type, data)
            except Exception as e:
                logger.warning(f"Failed to emit event {event_type}: {e}")

    def register_agent(self, name: str, agent: Any):
        """Register an agent with the orchestrator."""
        self.agents[name] = agent
        self.agent_types[agent] = name
        logger.info(f"Agent registered: {name}")

    def register_tool(self, name: str, tool: Any):
        """Register a tool with the orchestrator."""
        self.tools[name] = tool
        logger.info(f"Tool registered: {name}")

    async def execute_goal(self, goal: str, agent_mode: Optional[str] = None) -> Mission:
        """
        Main entry point: receive a user goal and execute it.
        If agent_mode is provided, route execution directly to that agent.
        Returns a Mission with status and steps.
        """
        mission_id = str(uuid.uuid4())[:8]
        mission = Mission(id=mission_id, goal=goal)
        self.active_missions[mission_id] = mission

        # Canonical agent mode: use the mode directly
        target_agent = agent_mode.upper() if agent_mode else None
        if target_agent and target_agent not in self.agents:
            # Fallback or error? Let's just log and clear if invalid
            logger.warning(f"Invalid agent mode requested: {target_agent}")
            target_agent = None

        logger.info(f"Mission {mission_id} started: {goal} (Agent Mode: {target_agent or 'AUTO'})")
        await self._emit_event("TASK_STARTED", {"task_id": mission_id, "goal": goal, "agent": target_agent or "AUTO"})

        try:
            # Step 1: Plan
            mission.status = MissionStatus.PLANNING
            await self._emit_event("PLANNING_STARTED", {"task_id": mission_id, "goal": goal})
            steps = await self.planner.decompose_goal(goal, self.context, target_agent=target_agent)
            mission.steps = [MissionStep(name=s["name"], agent=s.get("agent"), tool=s.get("tool")) for s in steps]
            logger.info(f"Mission {mission_id}: Planned {len(steps)} steps")
            await self._emit_event("PLANNING_COMPLETED", {"task_id": mission_id, "steps": [s.to_dict() for s in mission.steps]})


            # Step 2: Execute
            mission.status = MissionStatus.RUNNING
            self.context.active_task_id = mission_id
            self.context.event_callback = self._emit_event
            await self._execute_steps(mission)

            # Step 3: Check completion status
            failed_steps = [s for s in mission.steps if s.status == StepStatus.FAILED]
            if failed_steps:
                mission.status = MissionStatus.FAILED
                mission.completed_at = time.time()
                mission.result = self._compile_results(mission)
                logger.error(f"Mission {mission_id}: Failed ({len(failed_steps)} step(s) failed)")
                await self._emit_event("TASK_FAILED", {"task_id": mission_id, "error": failed_steps[0].error or "Step failed", "mission": mission.to_dict()})
            else:
                mission.status = MissionStatus.COMPLETED
                mission.completed_at = time.time()
                mission.result = self._compile_results(mission)
                logger.info(f"Mission {mission_id}: Completed")
                await self._emit_event("TASK_COMPLETED", {"task_id": mission_id, "result": mission.result, "mission": mission.to_dict()})

        except Exception as e:
            mission.status = MissionStatus.FAILED
            mission.result = f"Mission failed: {str(e)}"
            logger.error(f"Mission {mission_id}: Failed - {e}")
            await self._emit_event("TASK_FAILED", {"task_id": mission_id, "error": str(e)})

        finally:
            self.active_missions.pop(mission_id, None)
            self.completed_missions.append(mission)

        return mission

    async def _execute_steps(self, mission: Mission):
        """Execute each step in the mission sequentially."""
        for step in mission.steps:
            if mission.status == MissionStatus.PAUSED:
                break

            step.status = StepStatus.RUNNING
            step.started_at = time.time()

            # Use canonical agent ID for event if step.agent is set
            agent_id_for_event = step.agent
            if agent_id_for_event is None and step.agent in self.agent_types:
                # Find agent ID from step
                for name, ag in self.agents.items():
                    if ag == self._select_agent(step):
                        agent_id_for_event = name
                        break

            await self._emit_event("AGENT_STARTED", {
                "task_id": mission.id,
                "step_name": step.name,
                "agent": agent_id_for_event,
                "tool": step.tool
            })

            # Emit agent event for real-time status
            await self._emit_event("agent_event", {
                "task_id": mission.id,
                "agent": agent_id_for_event,
                "status": "RUNNING",
                "step_name": step.name
            })

            try:
                # Select agent for this step
                agent = self._select_agent(step)
                if agent:
                    # Use canonical agent ID from registry
                    agent_id = self.agent_types.get(agent, type(agent).__name__)
                    step.agent = agent_id
                    if step.tool:
                        await self._emit_event("TOOL_STARTED", {
                            "task_id": mission.id,
                            "agent": step.agent,
                            "tool": step.tool
                        })

                    result = await agent.execute(step, self.tools, self.context)
                    step.result = result
                    step.status = StepStatus.COMPLETED

                    if step.tool:
                        await self._emit_event("TOOL_COMPLETED", {
                            "task_id": mission.id,
                            "agent": step.agent,
                            "tool": step.tool,
                            "result_snippet": result[:200] if result else ""
                        })

                    await self._emit_event("AGENT_PROGRESS", {
                        "task_id": mission.id,
                        "step_name": step.name,
                        "agent": step.agent,
                        "status": "COMPLETED",
                        "result_snippet": result[:300] if result else ""
                    })

                    # Emit agent event for real-time status
                    await self._emit_event("agent_event", {
                        "task_id": mission.id,
                        "agent": step.agent,
                        "status": "COMPLETED",
                        "step_name": step.name
                    })

                else:
                    step.result = "No suitable agent found"
                    step.status = StepStatus.COMPLETED

            except Exception as e:
                step.error = str(e)
                step.status = StepStatus.FAILED
                logger.error(f"Step '{step.name}' failed: {e}")
                await self._emit_event("AGENT_FAILED", {
                    "task_id": mission.id,
                    "step_name": step.name,
                    "error": str(e)
                })

                # Emit agent event for real-time status
                await self._emit_event("agent_event", {
                    "task_id": mission.id,
                    "agent": step.agent,
                    "status": "FAILED",
                    "step_name": step.name,
                    "error": str(e)
                })

                # Attempt retry
                if await self._should_retry(step, mission):
                    logger.info(f"Retrying step '{step.name}'")
                    step.status = StepStatus.RUNNING
                    step.error = None
                    try:
                        agent = self._select_agent(step)
                        if agent:
                            agent_id = self.agent_types.get(agent, type(agent).__name__)
                            step.agent = agent_id
                            result = await agent.execute(step, self.tools, self.context)
                            step.result = result
                            step.status = StepStatus.COMPLETED
                    except Exception as retry_error:
                        step.error = str(retry_error)
                        step.status = StepStatus.FAILED

            step.completed_at = time.time()

    def _select_agent(self, step: MissionStep):
        """Select the most appropriate agent for a step."""
        if step.agent:
            # Direct agent assignment
            agent_type = step.agent.lower()
            for name, agent in self.agents.items():
                if agent_type in name.lower():
                    return agent

        # Auto-select based on step content
        step_lower = step.name.lower()
        for name, agent in self.agents.items():
            if agent.can_handle(step_lower):
                return agent

        return None

    async def _should_retry(self, step: MissionStep, mission: Mission) -> bool:
        """Determine if a failed step should be retried."""
        from ..config.settings import settings
        retry_count = sum(1 for s in mission.steps if s.name == step.name and s.status == StepStatus.FAILED)
        return retry_count < settings.max_agent_retries

    def _compile_results(self, mission: Mission) -> str:
        """Compile all step results into a final summary."""
        results = []
        for step in mission.steps:
            if step.result:
                results.append(f"[{step.name}] {step.result}")
        return "\n".join(results) if results else "No results"

    def get_mission(self, mission_id: str) -> Optional[Mission]:
        """Get a mission by ID."""
        return self.active_missions.get(mission_id) or \
            next((m for m in self.completed_missions if m.id == mission_id), None)

    def get_all_missions(self) -> list[dict]:
        """Get all active missions as dicts."""
        return [m.to_dict() for m in self.active_missions.values()]

    def get_all_agents(self) -> list[dict]:
        """Get status of all registered agents."""
        return [
            {
                "name": name,
                "type": type(agent).__name__,
                "state": agent.state.value if hasattr(agent, "state") else "IDLE",
                "current_task": agent.current_task if hasattr(agent, "current_task") else None,
                "runtime": agent.runtime if hasattr(agent, "runtime") else 0,
                "cpu_usage": 0,
                "memory_usage": 0,
            }
            for name, agent in self.agents.items()
        ]
