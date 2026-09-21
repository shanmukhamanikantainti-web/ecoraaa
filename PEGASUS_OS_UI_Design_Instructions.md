# PEGASUS OS — UI Design Instructions

**Version:** 2.0
**Status:** Updated — Desktop-First Direction
**Project:** PEGASUS OS
**Platform:** Android Smartphones (Landscape Desktop Mode)
**Design Direction:** Professional, minimal, Linux-inspired AI-native desktop operating environment

---

## 1. Design Objective

Design **PEGASUS OS** as a professional, minimal, Linux-grade desktop operating environment for Android smartphones.

When the device is rotated to landscape orientation, PEGASUS should present a desktop interface that feels like a compact AI-powered workstation — closer to GNOME, KDE Plasma, or a lightweight Linux desktop than to a smartphone UI.

The UI must look like it was created by an experienced OS/product design team, not generated as a futuristic AI concept.

The primary visual goal is:

> **A serious desktop operating system with intelligence built into it — running on a smartphone.**

PEGASUS should feel:

- Minimal
- Technical
- Professional
- Mature
- Fast
- Stable
- Functional
- Premium
- System-oriented
- Desktop-oriented

It must **not** feel like:

- An AI chatbot
- An AI dashboard
- A SaaS product
- A futuristic concept mockup
- A JARVIS/Iron Man clone
- A cyberpunk interface
- A gaming interface
- A mobile phone UI
- A stretched smartphone launcher

---

# 2. Core Design Philosophy

Follow this hierarchy:

```text
FUNCTION
   ↓
CLARITY
   ↓
CONSISTENCY
   ↓
INTELLIGENCE
   ↓
DECORATION
```

Decoration must never dominate functionality.

Every visual element should have a purpose.

The interface should look **engineered rather than decorated**.

---

# 3. Desktop-First Principle

PEGASUS is a desktop operating environment.

The primary interaction mode is **landscape orientation** with a desktop-style interface.

The UI must therefore be designed around:

- Desktop taskbar
- Window manager
- Application launcher (start menu style)
- System tray
- Desktop workspaces
- Multiple application windows
- Keyboard shortcuts (where keyboard available)
- Mouse/trackpad interaction (where available)
- Touch interaction (always supported)

Do not design the product as a mobile phone UI or a chatbot.

### Wrong

```text
Mobile Phone UI
 ↓
Bottom navigation bar
 ↓
Full-screen apps
 ↓
Touch-only gestures
```

### Correct

```text
PEGASUS DESKTOP
│
├── Taskbar (top)
├── Desktop workspace (center)
├── Window manager (floating windows)
├── Application launcher (start menu)
├── System tray (taskbar right)
└── Desktop workspaces (bottom)
```

PEGASUS intelligence should exist **throughout the desktop environment**.

---

# 4. Visual Style

Use a **dark Linux-inspired desktop UI**.

Take inspiration from the discipline and functionality of:

- Kali Linux
- GNOME
- KDE Plasma
- XFCE
- Modern Linux desktop environments

Do not copy their visual identity.

PEGASUS must have its own identity while maintaining the same level of seriousness and functionality.

---

# 5. Color System

Use a strict color palette.

## Background

| Usage | Color |
|---|---|
| Deep background | `#090C10` |
| Main background | `#0D1117` |
| Secondary background | `#11161D` |

## Surfaces

| Usage | Color |
|---|---|
| Primary surface | `#151B23` |
| Secondary surface | `#1A212B` |
| Elevated surface | `#202833` |

## Borders

| Usage | Color |
|---|---|
| Subtle border | `#2A333E` |
| Strong border | `#36414D` |

## PEGASUS Accent

Use a **muted teal**, not bright neon blue.

| Usage | Color |
|---|---|
| Primary accent | `#3FB8A5` |
| Hover | `#52C7B5` |
| Dark accent | `#287F73` |
| Accent background | `#102A27` |

Use teal only for:
- Active navigation
- Selected elements
- Focus states
- Important system states
- PEGASUS status
- Links
- Small indicators

Do **not** use teal everywhere.

## Text

| Usage | Color |
|---|---|
| Primary | `#E6EDF3` |
| Secondary | `#9DA7B3` |
| Tertiary | `#687481` |
| Disabled | `#4B5561` |

## Status

| State | Color |
|---|---|
| Success | `#4FAF78` |
| Warning | `#D6A84F` |
| Error | `#D05C5C` |
| Information | `#6B9FC8` |

### Color Ratio

```text
80% — Neutral dark
15% — Text / system elements
5%  — PEGASUS accent
```

---

# 6. Typography

Use a professional system-style sans-serif.

Preferred visual direction:
- Inter
- Roboto
- SF Pro-style typography
- Modern system sans-serif

For terminal and code: use a monospace font (JetBrains Mono, Fira Code, or similar).

### Hierarchy

```text
Large Title
24–28px

Section Title
18–20px

Body
14–16px

Secondary
12–14px

System Metadata
11–12px

Terminal / Code
12–14px monospace
```

Avoid oversized marketing typography.

The interface should prioritize information density and readability.

---

# 7. Icons

Use simple professional system icons.

Characteristics:
- Thin/medium stroke
- Consistent stroke width
- Simple geometry
- Mostly monochrome
- Minimal filled icons

Default:
`#9DA7B3`

Active:
`#E6EDF3`

PEGASUS-related active state:
`#3FB8A5`

Avoid:
- 3D icons
- Colorful icons
- Emoji-style icons
- Glowing icons
- Futuristic holographic symbols

---

# 8. Corner Radius

Keep the UI restrained.

Recommended:
```text
Small controls: 4px
Panels: 6px
Dialogs: 8px
Windows: 6px
Large containers: 8px maximum
```

Avoid making every element extremely rounded.

---

# 9. Shadows

Use very subtle shadows.

Prefer:
- Elevation through contrast
- Borders
- Surface color differences

Avoid:
- Large drop shadows
- Glowing shadows
- Neon outlines

---

# 10. Glassmorphism

Use **almost no glassmorphism**.

If transparency is used:
- Keep it subtle
- Preserve readability
- Use it mainly for system overlays (PEGASUS Command)

PEGASUS should look like a real desktop OS, not concept-art HUD.

---

# 11. Desktop Taskbar

Create a compact desktop taskbar positioned at the top of the screen.

```text
┌────────────────────────────────────────────────────────────────┐
│ PEGASUS │ Workspace │ Pinned Apps       │ Network │ 🔋 │ 13:42│
│   ◉     │  1 of 4   │ 📁 🖥️ 📝 🔬     │   ✓     │ 78% │      │
└────────────────────────────────────────────────────────────────┘
```

### Taskbar Sections

**Left:**
- PEGASUS launcher button (opens start menu)
- Current workspace indicator

**Center:**
- Running application indicators
- Pinned application shortcuts

**Right (System Tray):**
- Network status
- Battery level
- Time and date
- Notification indicators
- PEGASUS agent status indicator

### Taskbar Behavior
- Always visible (primary navigation surface)
- Compact height (approximately 32-40px)
- Click PEGASUS button → opens Application Launcher
- Click running app → switches to/focuses that window
- Click system tray → opens quick settings/notifications

---

# 12. Application Launcher (Start Menu)

The launcher should resemble a professional desktop start menu.

```text
┌─────────────────────────────────────────┐
│ PEGASUS                                 │
│                                         │
│ Search applications, files, commands... │
│                                         │
├─────────────────────────────────────────┤
│ Pinned                                  │
│ ─────────────────                       │
│ Browser      Code       Terminal        │
│ Files        Settings   Mission Control │
│                                         │
├─────────────────────────────────────────┤
│ Categories                              │
│ ─────────────────                       │
│ Development    Research    Internet     │
│ System         Utilities   Settings     │
│                                         │
├─────────────────────────────────────────┤
│ PEGASUS Commands                        │
│ ─────────────────                       │
│ Research...    Analyze...    Test...     │
└─────────────────────────────────────────┘
```

Launcher behavior:
- Opens from taskbar PEGASUS button
- Search filters applications and commands
- Click to launch application (opens in window)
- Click PEGASUS command → opens PEGASUS Command overlay
- Escape or click outside → closes launcher

---

# 13. Window Manager

Applications operate inside windows with standard desktop controls.

### Window Structure

```text
┌───────────────────────────────────────────────┐
│ Browser                              — □ ×    │
├───────────────────────────────────────────────┤
│                                               │
│                   Browser Content             │
│                                               │
│                                               │
└───────────────────────────────────────────────┘
```

### Window Controls

Each window has:
- **Title bar** — shows application name, allows drag to move
- **Minimize button (—)** — hides window to taskbar
- **Maximize button (□)** — fills workspace area
- **Close button (×)** — closes window
- **Content area** — application content

### Window States

```text
Normal     — default size and position
Minimized  — hidden, shown in taskbar only
Maximized  — fills available workspace area
Focused    — active window (brighter title bar)
Unfocused  — inactive window (dimmer title bar)
```

### Window Operations

- **Open** — application launches in new window
- **Close** — window destroyed, app may terminate
- **Move** — drag title bar to reposition
- **Resize** — drag edges/corners (where supported)
- **Focus** — click window to bring to front
- **Minimize** — hide to taskbar
- **Maximize/Restore** — toggle fill workspace

### Window Layout

Windows should be freely positionable within the desktop workspace area (below the taskbar).

The system should support 2-4 simultaneous windows depending on screen size.

Do not turn every application into a floating rounded card. Windows should feel like actual OS application windows.

---

# 14. Desktop Workspace Area

The main area between the taskbar (top) and workspace indicator (bottom) is the desktop workspace.

```text
┌─────────────────────────────────────────────────────────────┐
│ TASKBAR                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│                    DESKTOP WORKSPACE                          │
│                                                              │
│         Windows are positioned here                          │
│                                                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Desktop 1 │ Desktop 2 │ Desktop 3 │ Desktop 4                │
└─────────────────────────────────────────────────────────────┘
```

The desktop workspace:
- Has a subtle background (dark, minimal)
- Contains positioned windows
- Supports multiple windows side by side
- Each workspace is independent

---

# 15. Desktop Workspaces

PEGASUS supports multiple desktop workspaces, similar to Linux virtual desktops.

```text
┌─────────────────────────────────────────────────────────────┐
│ Desktop 1 (Coding)  │ Desktop 2 (Research) │ Desktop 3 │ ...│
└─────────────────────────────────────────────────────────────┘
```

Each workspace maintains its own:
- Windows
- Applications
- Files
- Context

Users can:
- Switch between workspaces (click bottom indicator)
- Create new workspaces
- Close workspaces

PEGASUS may automatically create a workspace from a user objective.

Example:
> "Start my software testing task."

PEGASUS creates:

```text
TESTING WORKSPACE

Terminal (for test execution)
Code Editor (for fixes)
Mission Control (for progress)
Browser (for documentation)
```

---

# 16. System Tray

The system tray occupies the right side of the taskbar.

```text
┌──────────────────────────────────┐
│ 🌐 │ 🔋 78% │ 🔔 │ ◉ │ 13:42  │
└──────────────────────────────────┘
```

System tray includes:
- Network status indicator
- Battery level and percentage
- Notification bell (with badge count)
- PEGASUS agent status indicator
- Time and date

Click behaviors:
- Network → network settings
- Battery → power settings
- Notifications → notification panel
- PEGASUS → agent status popup
- Time → date/time details

---

# 17. PEGASUS Global Command

PEGASUS should be accessible system-wide through a command palette.

Invocation:
- Keyboard shortcut: Ctrl+Shift+P
- Taskbar PEGASUS button (alternative)
- Launcher PEGASUS Commands section

The UI should be a compact command overlay centered on screen.

```text
┌──────────────────────────────────────────────┐
│ PEGASUS                                      │
│                                              │
│ > Analyze the current project                │
│                                              │
│ Suggested                                    │
│ ─────────                                    │
│ Run tests                                    │
│ Open engineering workspace                   │
│ Research this page                           │
│ Start coding session                         │
└──────────────────────────────────────────────┘
```

It should feel closer to **system search / command palette** (like VS Code's Ctrl+Shift+P or Spotlight) than a chatbot.

---

# 18. PEGASUS Presence

Do not use a giant AI orb.

PEGASUS can have a small system indicator in the taskbar.

```text
◉
```

States:

```text
IDLE        ◉
LISTENING   ◉ )))
THINKING    ◉ ◌
EXECUTING   ◉ →
COMPLETED   ✓
```

Keep these states subtle.

---

# 19. Agent Manager

Create a desktop utility similar to a Linux process manager (like htop or System Monitor).

```text
┌─────────────────────────────────────────────────────┐
│ AGENT MANAGER                           — □ ×       │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Agent            State      Task          Runtime    │
│ ────────────────────────────────────────────────────│
│ Testing Agent    RUNNING    Run tests     2:34       │
│ Research Agent   RUNNING    Search docs   1:12       │
│ Coding Agent     IDLE       —             —          │
│ Market Agent     IDLE       —             —          │
│                                                      │
│ Controls: [Pause] [Resume] [Stop] [Inspect]         │
└─────────────────────────────────────────────────────┘
```

Show:
- Agent name
- State (IDLE, RUNNING, COMPLETED, FAILED)
- Current task
- Runtime
- CPU usage
- Memory usage

Do not turn this into a colorful analytics dashboard. Keep it data-focused like a process manager.

---

# 20. Mission Control

Mission Control shows high-level user goals and their execution state.

```text
┌─────────────────────────────────────────────────────┐
│ MISSION CONTROL                          — □ ×       │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Mission: Analyze software project                   │
│                                                      │
│ Planning              ✓ COMPLETE    0:12             │
│ Repository Scan       ✓ COMPLETE    0:45             │
│ Test Execution        ✓ COMPLETE    1:23             │
│ Failure Analysis      ✓ COMPLETE    0:56             │
│ Research Cause        ✓ COMPLETE    2:11             │
│ Code Fix              ✓ COMPLETE    1:47             │
│ Retest                ✓ COMPLETE    0:34             │
│ Report Generation     ● RUNNING     —                │
│                                                      │
│ Controls: [Pause] [Resume] [Stop] [Inspect]         │
└─────────────────────────────────────────────────────┘
```

The UI should feel like a **system task manager**, not project-management SaaS.

---

# 21. Intelligence Center

The Intelligence Center should surface information that matters to the user.

```text
┌─────────────────────────────────────────────────────┐
│ INTELLIGENCE CENTER                    — □ ×         │
├─────────────────────────────────────────────────────┤
│                                                      │
│ NEW                                                  │
│ Battery cooling paper detected                       │
│ Relevance: HIGH                                      │
│ Why: Related to your current battery project.        │
│                                                      │
│ ─────────────────────────────────────────────────── │
│                                                      │
│ TREND                                                │
│ New testing framework gaining adoption               │
│ Relevance: MEDIUM                                    │
│ Why: Matches your development interests.             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

Use:
- Compact typography
- Clear hierarchy
- Minimal cards
- No social-media-style feed

---

# 22. Notifications

Notifications should be system-level.

PEGASUS may classify them:

```text
CRITICAL
HIGH
NORMAL
LOW
INFO
```

Important notifications should be prioritized.

Do not visually overwhelm the user.

Notifications may appear as:
- System tray badge
- Toast notifications (temporary overlay)
- Notification center (accessible from system tray)

---

# 23. File Manager

Use a professional Linux-style file manager.

```text
┌─────────────────────────────────────────────────────┐
│ FILES                                    — □ ×       │
├─────────────────────────────────────────────────────┤
│ 📁 Home > Projects > PEGASUS                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│ 📁 Documents          12 items                       │
│ 📁 Downloads           5 items                       │
│ 📁 Projects            8 items                       │
│ 📁 Code               15 items                       │
│ 📁 Research            3 items                       │
│ 📁 Reports             2 items                       │
│ 📁 PEGASUS             7 items                       │
│                                                      │
│ 📄 simulation.py       2.4 KB    Today               │
│ 📄 research.md         1.1 KB    Today               │
│ 📄 report.pdf         45.2 KB    Today               │
│                                                      │
└─────────────────────────────────────────────────────┘
```

Include:
- Path bar with navigation
- File/folder list with icons
- File metadata (size, date)
- Search
- Context menus (right-click)
- Storage information

PEGASUS intelligence can appear contextually, but the file manager should remain a proper file manager.

---

# 24. Terminal

Terminal must look authentic.

```text
┌─────────────────────────────────────────────────────┐
│ TERMINAL                               — □ ×        │
├─────────────────────────────────────────────────────┤
│                                                      │
│ pegasus@device:~$ run simulation.py                 │
│ Loading...                                           │
│ Simulation started                                   │
│ Simulation completed                                 │
│                                                      │
│ pegasus@device:~$ _                                 │
│                                                      │
└─────────────────────────────────────────────────────┘
```

Use:
- Dark background `#090C10`
- Monospace font
- Subtle text color
- Teal prompt (`#3FB8A5`)
- Red errors (`#D05C5C`)
- Yellow warnings (`#D6A84F`)

Do not make it look like a movie hacker terminal.

---

# 25. Settings

Settings should look like a mature desktop operating system.

```text
┌─────────────────────────────────────────────────────┐
│ SETTINGS                               — □ ×        │
├─────────────────────────────────────────────────────┤
│                                                      │
│ SYSTEM                                               │
│ ────────                                             │
│ Display                                              │
│ Network                                              │
│ Sound                                                │
│ Power                                                │
│ Storage                                              │
│                                                      │
│ SECURITY                                             │
│ ─────────                                            │
│ Privacy                                              │
│ Permissions                                          │
│ Applications                                         │
│                                                      │
│ PEGASUS                                              │
│ ────────                                             │
│ AI Models                                            │
│ Agents                                               │
│ Memory                                               │
│ Context                                              │
│ Automation                                           │
│                                                      │
└─────────────────────────────────────────────────────┘
```

Keep controls simple and predictable.

---

# 26. Memory UI

Memory should be treated as an OS capability.

```text
┌─────────────────────────────────────────────────────┐
│ PEGASUS MEMORY                         — □ ×        │
├─────────────────────────────────────────────────────┤
│                                                      │
│ USER                                                 │
│ Engineering student                                  │
│                                                      │
│ PROJECTS                                             │
│ ● Battery Research                                   │
│ ● Robotics                                           │
│ ● PEGASUS OS                                         │
│                                                      │
│ PREFERENCES                                          │
│ ● Python                                             │
│ ● Dark UI                                            │
│ ● Technical explanations                             │
│                                                      │
│ Controls: [Edit] [Forget] [Delete] [Disable Memory] │
└─────────────────────────────────────────────────────┘
```

The user must always have control.

---

# 27. Boot Screen

Keep the boot screen extremely minimal.

Background: `#090C10`
Text: `#E6EDF3`
Accent: `#3FB8A5`

```text
PEGASUS OS

SYSTEM ................. OK
KERNEL ................. OK
HARDWARE ............... OK
NETWORK ................ OK
STORAGE ................ OK
PEGASUS CORE ........... ONLINE
```

No cinematic logo animation.
No glowing effects.

---

# 28. Workspace Indicator

A compact workspace indicator at the bottom of the screen.

```text
┌─────────────────────────────────────────────────────────────┐
│ Desktop 1 │ Desktop 2 │ Desktop 3 │ Desktop 4                │
└─────────────────────────────────────────────────────────────┘
```

- Current workspace highlighted with accent color
- Click to switch workspaces
- Small and unobtrusive
- Optional: can be combined with taskbar

---

# 29. Window Context Menus

Right-click on windows, taskbar items, and desktop should provide context menus.

```text
┌─────────────────────────┐
│ Minimize                │
│ Maximize                │
│ Close                   │
│ ─────────────────────── │
│ Move to Desktop 2      │
│ Always on Top           │
└─────────────────────────┘
```

Context menus should use the same design language:
- Dark background (`#151B23`)
- Subtle border (`#2A333E`)
- Compact text
- Keyboard-accessible

---

# 30. Animation

Animations must communicate **system state**, not decoration.

Good uses:
- Window opening/closing
- Workspace transition
- Agent state change
- Notification arrival
- System overlay appearance
- Taskbar indicator updates

Avoid:
- Constant particle effects
- Floating elements
- Glowing animations
- Excessive transitions

Recommended durations:
```text
Micro interaction: 100–150ms
Window open/close: 150–200ms
Panel transition: 150–250ms
Workspace transition: 200–300ms
```

Animations should remain smooth on low-end devices.

---

# 31. Landscape-First Responsiveness

The primary layout is landscape.

### Primary: Landscape Smartphone

```text
┌─────────────────────────────────────────────────────────────┐
│ PEGASUS │ Workspace │ Apps        │ Network │ 🔋 │ 13:42    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    DESKTOP WORKSPACE                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Desktop 1 │ Desktop 2 │ Desktop 3 │ Desktop 4                │
└─────────────────────────────────────────────────────────────┘
```

### Secondary: Portrait (Fallback)

```text
┌──────────────────────┐
│ PEGASUS     │ 13:42  │
├──────────────────────┤
│                      │
│  Simplified mobile   │
│  view with key       │
│  applications        │
│                      │
├──────────────────────┤
│ ◉ PEGASUS            │
└──────────────────────┘
```

Portrait mode provides a simplified fallback. The full desktop experience requires landscape.

---

# 32. Desktop Interaction Model

### Touch Input

- **Tap** — select, open, focus
- **Long press** — context menu
- **Swipe** — scroll within windows
- **Drag title bar** — move window
- **Drag window edge** — resize window (where supported)

### Keyboard Input (Where Available)

- **Ctrl+Shift+P** — PEGASUS Command
- **Alt+Tab** — window switching
- **Super** — launcher
- **Ctrl+C/V** — copy/paste
- **Ctrl+W** — close window
- **Ctrl+Q** — quit application
- **F11** — fullscreen toggle

### Mouse/Trackpad Input (Where Available)

- **Left click** — select, open, focus
- **Right click** — context menu
- **Double click** — open
- **Drag** — move windows, resize
- **Scroll** — scroll within windows

---

# 33. Accessibility

Support:
- Large text
- High contrast
- Screen-reader compatibility where supported
- Reduced motion
- Touch accessibility
- Keyboard navigation
- Clear focus indicators

Do not rely only on color to communicate state.

---

# 34. Design System Components

Create reusable components for:
- Buttons
- Toggles
- Sliders
- Menus
- Tabs
- Lists
- Dialogs
- System panels
- Notifications
- Windows
- Taskbar items
- Context menus
- Progress indicators
- System indicators
- Agent status badges

All components must use the same:
- Typography
- Spacing
- Colors
- Borders
- Radius
- Iconography

---

# 35. Spacing System

Use an 8-point spacing system.

Primary spacing:
```text
4px
8px
12px
16px
24px
32px
48px
```

Avoid arbitrary spacing values.

Consistency is more important than decoration.

---

# 36. Information Density

PEGASUS should be **information-efficient but not cluttered**.

Use:
```text
Primary information
        ↓
Secondary information
        ↓
Metadata
```

Do not display everything simultaneously.

Use progressive disclosure for advanced information.

Desktop environments benefit from higher information density than mobile UIs.

---

# 37. AI Integration Rule

The most important UI rule:

> **PEGASUS should be present everywhere, but visually dominate nowhere.**

AI should appear when useful:
```text
User
 ↓
System
 ↓
PEGASUS understands context
 ↓
PEGASUS assists
 ↓
Desktop remains visible
```

The operating system is the product.
The AI is its intelligence layer.

---

# 38. Final Visual Test

Before approving any screen, ask:

### Does it look like:

> **A real desktop operating system made by an experienced engineering/design team?**

If yes, keep it.

If it looks like:
- AI concept art
- ChatGPT clone
- SaaS dashboard
- Cyberpunk interface
- Sci-fi movie UI
- Mobile phone UI
- Stretched smartphone launcher

then redesign it.

---

# 39. Final Design Statement

PEGASUS OS should communicate one idea visually:

> **"This is a real desktop operating system. It just happens to run on a smartphone and understand me."**

### Design Motto

> **Minimal by appearance. Powerful underneath.**

### Product Identity

**PEGASUS OS**

**Your phone. Your workstation. Your intelligence.**

**Intelligence beyond hardware.**
