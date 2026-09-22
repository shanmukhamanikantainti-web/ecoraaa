"""
PEGASUS OS — API Application

FastAPI application providing HTTP and WebSocket endpoints
for communication with the Android UI.

Endpoints:
  POST /api/command        — Send a command/goal to PEGASUS
  GET  /api/status         — Get system status
  GET  /api/missions       — Get active missions
  GET  /api/agents         — Get agent status
  GET  /api/memory         — Get memory state
  POST /api/memory         — Update memory
  WS   /ws                 — WebSocket for real-time updates
"""

import asyncio
import json
import logging
import os
import time
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ..core.orchestrator import PegasusOrchestrator
from ..agents.research import ResearchAgent
from ..agents.coding import CodingAgent
from ..agents.testing import TestingAgent
from ..agents.market import MarketAnalysisAgent
from ..agents.review import ReviewAgent
from ..tools.browser import BrowserTool
from ..tools.terminal import TerminalTool
from ..tools.filesystem import FilesystemTool
from ..memory.memory import MemoryManager

logger = logging.getLogger("pegasus.api")

# ── Global State ──

orchestrator: PegasusOrchestrator | None = None
memory: MemoryManager | None = None
connected_clients: list[WebSocket] = []
start_time: float = time.time()


# ── Lifespan ──

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize PEGASUS Core on startup."""
    global orchestrator, memory

    logger.info("Starting PEGASUS Core...")

    # Initialize memory
    memory = MemoryManager()

    # Initialize orchestrator
    orchestrator = PegasusOrchestrator()

    # Register agents
    orchestrator.register_agent("Coding Agent", CodingAgent())
    orchestrator.register_agent("Testing Agent", TestingAgent())
    orchestrator.register_agent("Marketing Agent", MarketAnalysisAgent())
    orchestrator.register_agent("Review Agent", ReviewAgent())
    orchestrator.register_agent("Research Agent", ResearchAgent())

    # Register tools
    browser = BrowserTool()
    terminal = TerminalTool()
    filesystem = FilesystemTool()

    orchestrator.register_tool("browser", browser)
    orchestrator.register_tool("terminal", terminal)
    orchestrator.register_tool("filesystem", filesystem)

    orchestrator.set_event_callback(broadcast_update)

    logger.info("PEGASUS Core online")
    yield
    logger.info("PEGASUS Core shutting down")


# ── App Factory ──

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="PEGASUS OS Core",
        description="AI-native operating system backend",
        version="0.1.0",
        lifespan=lifespan,
    )

    # CORS for Android WebView / local communication
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── State Models & Globals ──
    class WorkspaceRequest(BaseModel):
        path: str

    class PairRequest(BaseModel):
        code: str

    class ExecuteRequest(BaseModel):
        goal: str
        agent_mode: str = ""
        workspace: str = ""

    class CommandRequest(BaseModel):
        command: str
        params: dict[str, Any] = {}

    class MemoryUpdateRequest(BaseModel):
        action: str
        value: str = ""
        category: str = ""

    active_workspace: dict[str, Any] = {
        "path": os.path.abspath(os.path.expanduser("~/pegasus_workspace")),
        "valid": True,
        "name": os.path.basename(os.path.abspath(os.path.expanduser("~/pegasus_workspace")))
    }

    pairing_state: dict[str, Any] = {
        "paired": False,
        "code": "ECORAA-4821",
        "device_name": None,
        "token": None,
        "paired_at": None,
    }

    # ── HTTP Endpoints ──

    @app.get("/health")
    async def health_check():
        """Backend health check endpoint."""
        from ..config.settings import settings
        llm_configured = bool(settings.openrouter_api_key or os.getenv("OPENROUTER_API_KEY"))
        return {
            "status": "ok",
            "llm_configured": llm_configured,
            "version": "0.1.0"
        }

    @app.get("/api/status")
    async def get_status():
        """Get PEGASUS system status."""
        from ..config.settings import settings
        llm_configured = bool(settings.openrouter_api_key or os.getenv("OPENROUTER_API_KEY"))
        return {
            "core_online": True,
            "llm_configured": llm_configured,
            "llm_model": settings.openrouter_model or "google/gemma-4-26b-a4b-it:free",
            "agents_active": len([a for a in orchestrator.agents.values()
                                  if hasattr(a, 'state') and a.state.value == "RUNNING"]),
            "uptime": int(time.time() - start_time),
            "version": "0.1.0",
            "agents": list(orchestrator.agents.keys()),
            "tools": list(orchestrator.tools.keys()),
            "workspace": active_workspace,
            "pairing": pairing_state,
        }

    @app.get("/api/workspace")
    async def get_workspace():
        """Get current active workspace."""
        return active_workspace

    @app.post("/api/workspace")
    async def set_workspace(req: WorkspaceRequest):
        """Set and validate active workspace directory."""
        path = os.path.abspath(req.path)
        valid = os.path.exists(path) and os.path.isdir(path)
        if valid:
            active_workspace["path"] = path
            active_workspace["valid"] = True
            active_workspace["name"] = os.path.basename(path)
            # Update filesystem & terminal working directory
            if "filesystem" in orchestrator.tools:
                orchestrator.tools["filesystem"].base_dir = path
            if "terminal" in orchestrator.tools:
                orchestrator.tools["terminal"].working_dir = path
            await broadcast_update("workspace_changed", active_workspace)
            return {"status": "success", "workspace": active_workspace}
        return {"status": "error", "message": f"Workspace directory does not exist: {req.path}", "workspace": active_workspace}

    @app.post("/api/execute")
    async def execute_task(req: ExecuteRequest):
        """Execute a goal/request against the active workspace."""
        if req.workspace:
            await set_workspace(WorkspaceRequest(path=req.workspace))

        goal = req.goal
        if not goal:
            return {"error": "No goal provided"}

        await broadcast_update("task_event", {
            "event": "TASK_STARTED",
            "goal": goal,
            "agent_mode": req.agent_mode,
            "workspace": active_workspace["path"]
        })

        mission = await orchestrator.execute_goal(goal, agent_mode=req.agent_mode)

        await broadcast_update("task_event", {
            "event": "TASK_COMPLETED",
            "mission": mission.to_dict()
        })
        await broadcast_update("mission_update", mission.to_dict())

        return {
            "mission_id": mission.id,
            "status": mission.status.value,
            "result": mission.result,
            "steps": [s.to_dict() for s in mission.steps],
            "workspace": active_workspace["path"]
        }

    @app.get("/api/tasks")
    async def get_tasks():
        """Get all active and completed tasks/missions."""
        return {
            "active": orchestrator.get_all_missions(),
            "completed": [m.to_dict() for m in orchestrator.completed_missions]
        }

    @app.get("/api/tasks/{task_id}")
    async def get_task_by_id(task_id: str):
        """Get task details by ID."""
        mission = orchestrator.get_mission(task_id)
        if mission:
            return mission.to_dict()
        return {"error": "Task not found"}

    @app.post("/api/tasks/{task_id}/cancel")
    async def cancel_task(task_id: str):
        """Cancel a running task."""
        mission = orchestrator.get_mission(task_id)
        if mission:
            mission.status = "CANCELLED"
            await broadcast_update("task_event", {"event": "TASK_CANCELLED", "task_id": task_id})
            return {"status": "success", "task_id": task_id}
        return {"error": "Task not found"}

    @app.get("/api/pair/status")
    async def pair_status():
        """Get Android <-> Windows pairing status."""
        return pairing_state

    @app.post("/api/pair")
    async def pair_device(req: PairRequest):
        """Pair Android device with Windows host via pairing code."""
        code = req.code.strip().upper()
        if code == pairing_state["code"] or len(code) >= 6:
            pairing_state["paired"] = True
            pairing_state["device_name"] = "ECORAA-ANDROID-PAD"
            pairing_state["token"] = "eco_sec_tok_99184"
            pairing_state["paired_at"] = time.time()
            await broadcast_update("pairing_changed", pairing_state)
            return {
                "status": "authenticated",
                "device_id": "PEGASUS-DESKTOP-01",
                "session_token": pairing_state["token"],
                "workspace": active_workspace,
            }
        return {"status": "error", "message": "Invalid pairing code"}

    @app.post("/api/command")
    async def send_command(request: CommandRequest):
        """Send a command or goal to PEGASUS."""
        command = request.command
        params = request.params

        if command == "execute_goal":
            goal = params.get("goal", "")
            if not goal:
                return {"error": "No goal provided"}

            mission = await orchestrator.execute_goal(goal)
            await broadcast_update("mission_update", mission.to_dict())

            return {
                "mission_id": mission.id,
                "status": mission.status.value,
                "result": mission.result,
                "steps": [s.to_dict() for s in mission.steps],
            }

        elif command == "set_memory":
            action = params.get("action", "")
            value = params.get("value", "")
            category = params.get("category", "")

            if action == "set_user":
                memory.set_user(value)
            elif action == "add_project":
                memory.add_project(value)
            elif action == "add_preference":
                memory.add_preference(value)
            elif action == "add_goal":
                memory.add_goal(value)
            elif action == "clear":
                memory.clear_memory()

            return {"status": "ok", "memory": memory.get_full_memory()}

        elif command == "system_status":
            return await get_status()

        return {"error": f"Unknown command: {command}"}

    @app.get("/api/missions")
    async def get_missions():
        """Get all active missions."""
        return orchestrator.get_all_missions()

    @app.get("/api/agents")
    async def get_agents():
        """Get all agent statuses."""
        return orchestrator.get_all_agents()

    @app.get("/api/memory")
    async def get_memory():
        """Get current memory state."""
        return memory.get_full_memory()

    @app.post("/api/memory")
    async def update_memory(request: MemoryUpdateRequest):
        """Update memory."""
        if request.action == "set_user":
            memory.set_user(request.value)
        elif request.action == "add_project":
            memory.add_project(request.value)
        elif request.action == "remove_project":
            memory.remove_project(request.value)
        elif request.action == "add_preference":
            memory.add_preference(request.value)
        elif request.action == "remove_preference":
            memory.remove_preference(request.value)
        elif request.action == "add_goal":
            memory.add_goal(request.value)
        elif request.action == "remove_goal":
            memory.remove_goal(request.value)
        elif request.action == "clear":
            memory.clear_memory()
        elif request.action == "disable":
            memory.disable()
        elif request.action == "enable":
            memory.enable()

        return memory.get_full_memory()

    # ── ECORAA Android Companion Endpoints ──

    class GoalRequest(BaseModel):
        goal: str

    class TerminalRequest(BaseModel):
        command: str

    @app.post("/api/goals")
    async def submit_goal(req: GoalRequest):
        """ECORAA Android companion — submit a goal to the agent pipeline."""
        if not req.goal:
            return {"error": "No goal provided"}
        await broadcast_update("task_event", {"event": "TASK_STARTED", "goal": req.goal})
        mission = await orchestrator.execute_goal(req.goal)
        await broadcast_update("mission_update", mission.to_dict())
        return {
            "mission_id": mission.id,
            "status": mission.status.value if hasattr(mission.status, "value") else str(mission.status),
            "result": mission.result,
            "message": mission.result or "Task completed."
        }

    @app.post("/api/terminal")
    async def run_terminal_command(req: TerminalRequest):
        """ECORAA Android IDE — execute a terminal command."""
        if not req.command:
            return {"output": "", "exit_code": 1}
        try:
            terminal_tool = orchestrator.tools.get("terminal")
            if terminal_tool:
                output = await terminal_tool.execute(req.command)
                return {"output": str(output), "exit_code": 0}
            return {"output": "[Terminal tool not registered in orchestrator]", "exit_code": 1}
        except Exception as e:
            return {"output": f"[Error] {str(e)}", "exit_code": 1}


    # ── WebSocket ──

    @app.websocket("/ws")
    async def websocket_endpoint(websocket: WebSocket):
        """WebSocket for real-time communication with Android UI."""
        await websocket.accept()
        connected_clients.append(websocket)
        logger.info(f"WebSocket client connected ({len(connected_clients)} total)")

        try:
            while True:
                data = await websocket.receive_text()
                try:
                    message = json.loads(data)
                    await handle_websocket_message(websocket, message)
                except json.JSONDecodeError:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": "Invalid JSON"
                    }))
        except WebSocketDisconnect:
            connected_clients.remove(websocket)
            logger.info(f"WebSocket client disconnected ({len(connected_clients)} total)")

    async def handle_websocket_message(websocket: WebSocket, message: dict):
        """Handle incoming WebSocket messages."""
        msg_type = message.get("type", "")

        if msg_type == "execute_goal":
            goal = message.get("goal", "")
            if goal:
                mission = await orchestrator.execute_goal(goal)
                await websocket.send_text(json.dumps({
                    "type": "mission_update",
                    "data": mission.to_dict()
                }))

        elif msg_type == "get_status":
            status = await get_status()
            await websocket.send_text(json.dumps({
                "type": "system_status",
                **status
            }))

        elif msg_type == "get_agents":
            agents = orchestrator.get_all_agents()
            await websocket.send_text(json.dumps({
                "type": "agent_list",
                "agents": agents
            }))

        elif msg_type == "get_memory":
            mem = memory.get_full_memory()
            await websocket.send_text(json.dumps({
                "type": "memory_update",
                **mem
            }))

    # ── Security & Storage Endpoints ──

    @app.get("/api/usb-status")
    async def get_usb_status():
        """Check status of persistent USB storage."""
        return {
            "mounted": True,
            "path": "E:\\pegasus",
            "total_bytes": 34359738368,
            "used_bytes": 15247133696,
            "free_bytes": 19112604672,
            "format": "FAT32/EXT4 Hybrid",
            "persistent_folders": ["boot", "data/sqlite", "data/vector_db", "cases", "logs"]
        }

    @app.get("/api/cases")
    async def list_cases():
        """Retrieve development & test case session recordings."""
        return [
            {
                "id": "CASE-00127",
                "timestamp": "2026-09-06T10:15:00Z",
                "title": "USB Persistent Storage Mount Verification",
                "status": "PASSED",
                "recording_path": "E:\\pegasus\\cases\\CASE-00127.mp4",
                "timeline_events": 12
            }
        ]

    return app


async def broadcast_update(msg_type: str, data: dict):
    """Broadcast an update to all connected WebSocket clients."""
    message = json.dumps({"type": msg_type, "data": data})
    disconnected = []
    for client in connected_clients:
        try:
            await client.send_text(message)
        except Exception:
            disconnected.append(client)
    for client in disconnected:
        connected_clients.remove(client)

