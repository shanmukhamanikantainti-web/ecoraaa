# PEGASUS OS

**Intelligence beyond hardware.**

> Don't replace the device. Upgrade its intelligence.

PEGASUS OS is an AI-native operating environment that transforms existing Android smartphones into personalized intelligent computers. Instead of another AI application, PEGASUS integrates intelligence into the operating system itself — allowing users to give goals, coordinate applications, execute agentic workflows, maintain personal context, and receive relevant information through a single system-level intelligence layer.

---

## Architecture

```text
                    USER
                     │
             Touch / Voice / Text
                     │
            PEGASUS SYSTEM UI (Android/Kotlin)
                     │
            PEGASUS CORE (Python Backend)
                     │
          ┌──────────┼──────────┐
          │          │          │
      Planner    Memory    Context
          │
          ▼
    AGENT ORCHESTRATOR
    ┌─────┴─────┐
    │           │
 Research   Coding
  Agent     Agent
    │           │
    └─────┬─────┘
          │
      TOOL LAYER
   ┌──────┼──────┐
   │      │      │
Browser Terminal Files
```

## Project Structure

```text
pegasus-os/
├── android/                    # Android OS shell (Kotlin + Jetpack Compose)
│   ├── app/src/main/
│   │   ├── java/com/pegasus/os/
│   │   │   ├── ui/            # All UI screens and components
│   │   │   │   ├── theme/     # Colors, Typography, Theme
│   │   │   │   ├── screens/   # Home, Launcher, Mission Control, etc.
│   │   │   │   ├── components/# System Bar, reusable components
│   │   │   │   └── navigation/# Routes and navigation graph
│   │   │   ├── core/          # PegasusCoreManager (WebSocket/HTTP client)
│   │   │   └── service/       # Boot receiver, background service
│   │   └── res/               # Android resources
│   └── build.gradle.kts
│
├── backend/                    # Python PEGASUS Core backend
│   ├── main.py                # Entry point
│   ├── requirements.txt
│   └── pegasus/
│       ├── core/              # Orchestrator, Planner, Context, Permissions
│       ├── agents/            # Research Agent, Coding Agent (+ base class)
│       ├── tools/             # Browser, Terminal, Filesystem tools
│       ├── memory/            # Persistent memory system
│       ├── api/               # FastAPI HTTP + WebSocket endpoints
│       └── config/            # Settings and configuration
│
├── docs/                      # Documentation
│   ├── PEGASUS_OS_Project_Proposal.md
│   ├── PEGASUS_OS_SRS.md
│   ├── PEGASUS_OS_System_Requirements.md
│   └── PEGASUS_OS_UI_Design_Instructions.md
│
└── shared/                    # Shared types/schemas
```

## Getting Started

### Backend (Python)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env  # Configure your API keys
python main.py
```

The PEGASUS Core starts on `http://0.0.0.0:8420`.

### Android (Kotlin + Compose)

Open `android/` in Android Studio and build.

The Android app connects to the Python backend via WebSocket at `ws://127.0.0.1:8420/ws`.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/status` | System status |
| POST | `/api/command` | Send commands and goals |
| GET | `/api/missions` | Active missions |
| GET | `/api/agents` | Agent statuses |
| GET | `/api/memory` | Memory state |
| POST | `/api/memory` | Update memory |
| WS | `/ws` | Real-time communication |

### Example: Execute a Goal

```bash
curl -X POST http://localhost:8420/api/command \
  -H "Content-Type: application/json" \
  -d '{"command": "execute_goal", "params": {"goal": "Research battery cooling and compare current approaches"}}'
```

## UI Design

PEGASUS OS uses a dark, Linux-inspired design system:

- **Background:** `#0D1117` (main), `#090C10` (deep)
- **Accent:** `#3FB8A5` (muted teal) — used sparingly, 5% of interface
- **Text:** `#E6EDF3` (primary), `#9DA7B3` (secondary)
- **Design principle:** 80% neutral dark, 15% text/system, 5% accent

> "This is a real operating system. It just happens to understand me."

## MVP Status

**P0 — Built:**
- ✅ Android system shell (Home, System Bar, Navigation)
- ✅ Application launcher with categories
- ✅ PEGASUS Global Command overlay
- ✅ Workspace manager
- ✅ Mission Control
- ✅ Agent Manager
- ✅ Terminal emulator
- ✅ File Manager
- ✅ Settings panel
- ✅ Memory UI
- ✅ Intelligence Center
- ✅ Boot screen
- ✅ Python PEGASUS Core backend
- ✅ Agent Orchestrator
- ✅ Research Agent
- ✅ Coding Agent
- ✅ Browser, Terminal, Filesystem tools
- ✅ Persistent memory system
- ✅ HTTP + WebSocket API

## License

Proprietary — PEGASUS OS Project
