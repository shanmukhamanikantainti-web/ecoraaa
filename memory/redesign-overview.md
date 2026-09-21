---
name: pegasus-redesign-overview
description: Complete PEGASUS application redesign from scratch
metadata:
  type: project
---

# PEGASUS Redesign Project Overview

## Redesign Principles (from specification)

1. **AI-native computing experience** — designed around phone + computer as one unified workstation
2. **Goal-oriented workflow** — User Goal → Understand → Plan → Permission → Execute → Observe → Adapt → Result → Memory
3. **PEGASUS as primary interface** — CTRL+SPACE = Ask PEGASUS, accessible everywhere
4. **One unified experience** — Not a collection of unrelated pages, but one coherent operating environment
5. **User always in control** — Pause, Stop, Take Control, Approve, Deny at any point
6. **Desktop-first** — Keyboard, mouse, shortcuts, drag/drop, window management prioritized
7. **Visual design** — Clean, premium, professional engineering + modern OS + AI assistant
8. **Approved palette** — #2F7EDA (primary blue), #FAFAFA (background), #EDEFF3 (secondary), #C6D1D7 (border), #9FA0B5 (secondary accent), #555663 (dark neutral)
9. **Typography** — Inter/Segoe UI/system-ui, modern, professional, compact, readable
10. **Responsive** — 1280×720 through 2560×1440+, intelligent adaptation not just scaling

## Workflow (new PEGASUS workflow)

```
USER GOAL
    ↓
PEGASUS UNDERSTANDS
    ↓
PEGASUS PLANS
    ↓
PERMISSION          (user explicitly approves desktop/actions)
    ↓
PEGASUS EXECUTES
    ↓
PEGASUS OBSERVES
    ↓
PEGASUS ADAPTS
    ↓
RESULT
    ↓
MEMORY
```

## Two-Layer Architecture

```
PEGASUS OS (Android smartphone)
  → Personal AI assistant
  → AI runtime  
  → Agent orchestrator
  → Memory system
  → Context engine
  → Personal knowledge layer
  → Task planner
  → Mobile-side intelligence layer

PEGASUS Connect (Computer desktop)
  → Communication bridge
  → Desktop control bridge
  → Screen bridge
  → Input bridge
  → File bridge
  → Device manager
  → AI-to-desktop interface
  → Desktop execution environment

Together: ONE AI-NATIVE WORKSTATION
  → Phone = intelligence layer
  → Computer = workstation/execution layer  
  → Connect = bridge between them
```

## New Design Phases

### Phase 1: System Architecture ✓
- Two-layer intelligence+execution model
- Agent ecosystem (Orchestrator, Research, Coding, Testing, Market)
- Permission system with granular control
- Memory and Cases system design

### Phase 2: Command Center (NEXT)
- Home screen: "What are you working on?"
- Quick commands, active tasks, recent workspaces, connected devices
- Not a metrics dashboard

### Phase 3: Global Shell + Navigation
- Persistent navigation: Command Center | Workspaces | Files | Console | Screen Mirror | Cases | AI & Memory | Settings | Help
- Global Search: CTRL+K
- Global Command Center: CTRL+SPACE

### Phase 4: Connection + Permissions
- Connection flow: 7 steps from setup
- Connection states: Connecting → Connected → Reconnecting → Disconnected → Permission Required → Limited Access → Connection Error
- Permission Center with Allow once/Session/Always/Deny options

### Phase 5: Workspaces
- Goal-oriented: Development, Research, Testing, Analysis, Personal
- Auto-prepare workspace with applications, files, AI tasks

### Phase 6: AI Task Execution
- Dedicated task views with step tracking
- Live actions: ✓ Complete ● Working ○ Waiting ○ Pending
- Pause/Stop/Take Control/Approve at any point

### Phase 7: Files + Console + Mirror
- Unified file system showing Computer/PEGASUS/Phone paths
- Console: terminal with history, search, export
- Screen mirror: live phone/desktop, FPS/latency/resolution controls

### Phase 8: Cases + Memory
- Persistent work records (Cases)
- AI memory: Personal, Project, Session, Knowledge categories
- Search, inspect, pin, delete memory

### Phase 9: Settings + Help
- Ecosystem-wide settings categories
- Help explaining how PEGASUS works, connection, permissions, agents, memory, workspaces, cases, security

### Phase 10: Connect everything into one coherent product

## Key New Components

### 1. PEGASUS Command Center Overlay (CTRL+SPACE)
- Entry point: "Ask PEGASUS..."
- Natural language: "Fix the failing tests", "Research this error", "Mirror my phone"
- Starts AI task execution workflow

### 2. Global Search (CTRL+K)
- Search files, applications, workspaces, cases, commands, memory, conversations, AI tasks, devices
- OS-level command/search interface feel

### 3. Command Center (home screen)
- Greeting: "Good morning. What are you working on?"
- Continue Working section with recent authentications, developments, etc.
- Active Tasks section
- Recent Workspaces
- Connected Devices: PEGASUS Phone — Connected, Desktop — Connected

### 4. Desktop Control Overlay
- Screen viewing, screenshot, streaming
- Mouse: move, click, double-click, drag, scroll
- Keyboard: typing, shortcuts, text entry
- Applications: open, close, switch, focus
- Files: read, create, edit, copy, move, organize
- Terminal: execute approved commands, read output, analyze errors

### 5. Task Execution View
```
Fix Authentication Error

Working...

✓ Opened project
✓ Inspected build logs
✓ Located authentication module
✓ Analyzed dependency tree
● Modifying source
○ Running tests
○ Verifying solution
```

### 6. Permission Center
```
Desktop Access
Screen Access       Enabled
Mouse Control       Enabled
Keyboard Control    Enabled
Application Control Enabled
File Access         Limited
Terminal Access     Enabled

Actions: Allow once / Allow for session / Always allow / Deny
```

### 7. Unified Device View
```
┌─────────────────┬─────────────────────────┐
│ PEGASUS PHONE   │ DESKTOP                 │
│                 │                         │
│ AI Assistant    │ VS Code                 │
│                 │ Terminal                │
│                 │ Browser                 │
└─────────────────┴─────────────────────────┘
```

### 8. Screen Mirror (major capability)
- Live phone screen, desktop screen
- Connection: FPS, latency, resolution, orientation
- Mouse, keyboard, touch
- Screenshot, recording, remote control
- Phone ↔ Desktop mirroring where supported

### 9. Goal-Oriented Workspaces
```
Development
  → VS Code, Terminal, Browser, Project Files, Build Monitor, Testing, PEGASUS AI

Research
  → Browser, Notes, Research Agent, Papers, Documents

Testing
  → Test suites, Device testing, Logs, Screenshots, PEGASUS AI

Analysis
  → IDE, Data files, Plotting tools, PEGASUS AI, Reports
```

### 10. Cases (persistent work records)
```
Authentication Failure Investigation
  → User request, task plan, AI actions, screenshots, recordings
  → Terminal commands, logs, source changes, tests, research, final result
  → Reopen later to continue or review
```

### 11. Memory system
```
Personal: preferences, common workflows, frequently used tools
Project: project architecture, dependencies, known problems, important files
Session: previous actions, results, screenshots, recordings
Knowledge: research, documentation, findings
```

### 12. AI Agent ecosystem
```
Orchestrator → Coordinates all agents
Coding Agent → IDE, source code, terminal, build systems, tests
Research Agent → Browser, documentation, research
Testing Agent → Test suites, device testing, logs, screenshots
Market Analysis Agent → Market research, competitor analysis, reports, data
```

### 13. Agent visualization
```
PEGASUS ORCHESTRATOR
Research Agent       ✓ Complete
Coding Agent         ● Working
Testing Agent        ○ Waiting
```

### 14. Console & Logs
```
Terminal: command execution, history, output, search, clear, export
Logs: timestamp, level, source, message
Events: device events, AI events, desktop events, application events, workflow events
```

### 15. Session Recording
- Record: desktop screen, phone screen, AI actions, commands, files changed, events, timestamps
- Analyze Session: "Why did this workflow fail?"

### 16. File System (unified)
```
Computer
 ├─ Projects
 ├─ Documents
 └─ Downloads

PEGASUS Phone
 ├─ Projects
 ├─ Screenshots
 ├─ Recordings
 └─ Documents

PEGASUS
 ├─ Cases
 ├─ Memory
 └─ Sessions
```

### 17. Connection Flow (first-time setup)
```
Step 1: Connect PEGASUS Phone
Step 2: Open PEGASUS Connect
Step 3: Phone displays pairing code: 482 719
Step 4: Enter code on computer
Step 5: Verify connection
Step 6: Request permissions
Step 7: PEGASUS is ready to work
```

### 18. Connection States
```
Connecting → Connected → Reconnecting → Disconnected → Permission Required → Limited Access → Connection Error
USB Connected → Wi-Fi Connected
```

## Files to Create/Redesign

New structure replacing old dashboard-first approach:

```
/ui/
  CommandCenterScreen.kt          ← Home: "What are you working on?"
  GlobalSearchScreen.kt           ← CTRL+K
  PegasusCommandOverlay.kt        ← CTRL+SPACE entry
  WorkspacesScreen.kt             ← Goal-oriented workspaces
  DeviceDashboardScreen.kt        ← Phone + Desktop view
  ScreenMirrorScreen.kt           ← Major capability
  TaskExecutionScreen.kt          ← Live task tracking
  PermissionCenterScreen.kt       ← Granular permissions
  CasesScreen.kt                  ← Persistent work records
  MemoryScreen.kt                 ← AI memory system
  SettingsScreen.kt               ← Ecosystem settings
  HelpSupportScreen.kt            ← Visual explanations
  NavigationBar.kt                ← Persistent navigation
  GlobalCommandCenter.kt          ← CTRL+SPACE overlay
  GlobalSearch.kt                 ← CTRL+K overlay

/backend/
  orchestrator.py                   ← Updated with new workflow
  context.py                        ← Enhanced context management
  permissions.py                    ← Granular permission system
  agents/                           ← Updated agent ecosystem
  memory/                           ← New memory system
  cases/                            ← New cases system
  planners/                         ← Goal decomposition planners

/design/
  color-system.md                   ← Approved palette
  typography.md                     ← Font specifications
  components/                       ← Unified design system
  motion/                           ← Subtle transitions