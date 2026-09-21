# ECORAA — MASTER UI/UX DESIGN DIRECTIVE

You are now responsible for designing and implementing the UI/UX of **ECORAA**.

This is a premium AI-powered personal computing application.

The goal is **not** to produce a generic modern UI.

The goal is to create a **world-class product experience** with exceptional visual refinement, interaction design, typography, iconography, motion, spacing, and consistency.

---

# 1. LOAD YOUR UI/UX SKILL FIRST

Before doing ANY UI/UX work:

1. Inspect the available Claude/project skills.
2. Find the relevant **UI/UX / Product Design / Frontend Design / Design System** skill.
3. Load and read the complete skill instructions.
4. Follow those instructions throughout this task.

If the skill provides a design workflow, use that workflow.

**Do not skip this step.**

---

# 2. FIRST INSPECT THE EXISTING PROJECT

Before modifying UI code, inspect:

* current Flutter structure
* existing screens
* routing
* Bloc/state management
* theme
* reusable components
* models
* services
* backend connection
* existing functionality

Understand the architecture first.

Do not destroy working functionality.

Do not rewrite the Python backend.

Do not randomly restructure the application.

---

# 3. STOP UI SLOP

Do NOT produce generic AI-generated UI.

Avoid:

* generic SaaS dashboards
* dashboard card grids
* excessive cards
* giant rounded rectangles
* excessive pills
* random gradients
* purple AI gradients
* neon
* cyberpunk
* gaming aesthetics
* futuristic HUDs
* giant glowing AI orbs
* excessive sparkle icons
* emoji UI icons
* generic icon-library usage everywhere
* meaningless decoration
* fake statistics
* unnecessary charts
* excessive shadows
* excessive borders
* excessive glassmorphism
* default Material 3 appearance
* template-like layouts

If an element does not improve the user's experience:

**remove it.**

---

# 4. DESIGN QUALITY BAR

ECORAA should feel like a **premium flagship technology product**.

Use the same level of design discipline associated with Apple's best products as a quality reference:

* simplicity
* craftsmanship
* precision
* typography
* whitespace
* hierarchy
* consistency
* interaction quality
* subtle motion
* excellent iconography
* material depth

**Do NOT copy Apple.**

Do not reproduce Apple's:

* layouts
* icons
* components
* branding
* exact visual designs

Create an original ECORAA identity.

The target is:

> **Apple-level design discipline + ECORAA's own identity.**

---

# 5. ECORAA PRODUCT PHILOSOPHY

ECORAA connects:

**Person → Intelligence → Computer → Work**

The user should feel like they have an intelligent companion capable of helping them accomplish complex work.

The product should feel:

* intelligent
* premium
* calm
* confident
* minimal
* precise
* sophisticated
* trustworthy

When nothing is happening:

**quiet.**

When ECORAA is working:

**alive.**

The interface should communicate that difference through behavior rather than decoration.

---

# 6. INFORMATION HIERARCHY

Use this hierarchy:

### Human

The user comes first.

### Intent

What does the user want?

### Intelligence

What is ECORAA doing?

### Work

What is being produced?

### Technical detail

Logs, agents, commands and system details are secondary and progressively disclosed.

Do not expose technical complexity everywhere.

---

# 7. COLOR SYSTEM

Use ONLY the ECORAA palette:

| Color             | Hex       | Usage              |
| ----------------- | --------- | ------------------ |
| Near White        | `#FAFAFA` | Main background    |
| Springtime Rain   | `#EDEFF3` | Secondary surfaces |
| Wind Weaver       | `#C6D1D7` | Borders/dividers   |
| Wild Thistle      | `#9FA0B5` | Muted information  |
| Soothing Sapphire | `#2F7EDA` | Primary accent     |
| Blackwater        | `#555663` | Primary text       |

Visual balance should approximately feel like:

```text
60%  #FAFAFA
20%  #EDEFF3
8%   #C6D1D7
5%   #555663
5%   #9FA0B5
2%   #2F7EDA
```

This is a visual guideline, not a strict mathematical requirement.

The interface should remain predominantly:

**light + neutral + airy**

Sapphire blue should be a **precision accent**, not the dominant color.

---

# 8. PREMIUM GLASS MATERIAL

ECORAA should use a restrained premium translucent material system.

Use glass selectively for:

* Command Palette
* floating command interfaces
* contextual panels
* dialogs
* AI activity surfaces
* floating toolbars
* connection overlays
* selected navigation surfaces where appropriate

Glass should use:

* subtle transparency
* soft background blur
* thin edge definition
* extremely subtle shadows
* neutral tint
* slight depth

Use:

```text
Transparency
+
Blur
+
Thin Edge
+
Soft Shadow
+
Strong Typography
```

Do NOT make every component glass.

Do NOT create generic glassmorphism.

The glass should feel like a **physical material layer**, not a visual effect.

If readability suffers:

**reduce the glass effect.**

Typography always has priority.

---

# 9. TYPOGRAPHY

Prefer:

**Inter**

or an equivalent high-quality modern sans-serif.

Typography should create hierarchy through:

* size
* weight
* spacing
* alignment
* contrast

Do not make everything bold.

Do not use enormous headings simply to fill space.

Terminal/code content may use:

**JetBrains Mono**

---

# 10. ICONOGRAPHY

Iconography is a core part of ECORAA's identity.

Do not blindly use a generic icon library everywhere.

Create a coherent ECORAA icon language.

Icons should be:

* minimal
* geometric
* refined
* recognizable
* optically balanced
* consistent in weight
* beautiful at small sizes

Create custom conceptual icons for important ECORAA functions where appropriate:

* Command Center
* Intelligence
* Memory
* Workspace
* Cases
* Agents
* Connection
* Computer

Avoid:

* emoji
* generic AI brains
* excessive sparkles
* random icon styles

---

# 11. ECORAA SYMBOL

Create a distinctive ECORAA visual mark.

It should work at:

* 16px
* 32px
* application icon size
* large presentation size

It should be:

* simple
* geometric
* recognizable
* scalable
* original

Do not create a generic AI sparkle logo.

---

# 12. SHAPE LANGUAGE

Use restrained corner radii.

Avoid:

* everything being a pill
* excessive rounded cards
* giant rounded rectangles

Suggested hierarchy:

```text
Small controls:        5–6px
Inputs:                6px
Panels:                8–12px
Floating surfaces:     12–16px
Large command surface: 16–20px
```

Not every element needs a border, background, or rounded container.

---

# 13. SPACING

Whitespace is a core design element.

Do not fill empty space simply because it exists.

Use whitespace to communicate:

* hierarchy
* focus
* importance
* calm
* quality

The interface should breathe.

---

# 14. COMMAND CENTER

This is the most important screen.

It must NOT look like a dashboard.

Do not fill it with statistics.

The primary interaction is:

> **What would you like ECORAA to accomplish?**

Example:

```text
Good evening.

What would you like to accomplish?

[ Ask ECORAA... ]
```

The simplicity is intentional.

Subtly expose:

* current work
* recent work
* active tasks
* connected computer
* important context

The user should immediately understand:

> **I tell ECORAA what I want. ECORAA handles the complexity.**

---

# 15. AI INTERACTION

Do not make ECORAA look like another ChatGPT clone.

The core model is:

**Intent → Planning → Execution → Result**

Not:

**Chat bubble → Chat bubble → Chat bubble**

When ECORAA executes a task, show elegant progress.

Example:

```text
Investigating project failure

✓ Inspected project
✓ Found dependency conflict
◉ Running tests
○ Preparing fix
```

Allow details to expand when requested.

Use **progressive disclosure**.

---

# 16. PROGRESSIVE DISCLOSURE

Provide multiple levels of information.

Normal:

> ECORAA is investigating the project.

Expanded:

> Reading package configuration...

Advanced:

> package.json → dependency resolution → version conflict

The user should control how much technical detail they see.

---

# 17. DESKTOP EXPERIENCE

ECORAA desktop must feel like a **premium native application**.

Not:

* a website
* a browser admin panel
* a SaaS dashboard

Use:

* elegant navigation
* clean toolbar
* spacious workspace
* split views
* contextual panels
* command palette
* keyboard shortcuts
* subtle window transitions

Avoid visual clutter.

---

# 18. MOBILE EXPERIENCE

Mobile should feel like the same product, not a compressed desktop.

Prioritize:

1. Ask ECORAA
2. Current tasks
3. Active work
4. Computer connection
5. Workspaces
6. Notifications
7. Memory/context

Adapt the hierarchy intelligently.

---

# 19. COMMAND PALETTE

Shortcut:

`Ctrl + Space`

Design it as a core ECORAA interaction.

It should allow:

* starting tasks
* opening projects
* searching files
* opening cases
* searching memory
* switching workspace
* connecting computer
* launching tools

It should feel instantaneous and premium.

Use the glass material system.

---

# 20. GLOBAL SEARCH

Shortcut:

`Ctrl + K`

Search:

* projects
* files
* conversations
* cases
* memory
* workspaces
* commands

Results should be beautifully grouped and extremely easy to scan.

---

# 21. MOTION

Motion must communicate cause and effect.

Use it for:

* transitions
* focus
* selection
* AI activity
* progress
* connection
* expanding details
* panel appearance

Motion should be:

* smooth
* fast
* subtle
* physically believable

Avoid:

* bouncing
* flashy transitions
* unnecessary particles
* constant glowing animations

---

# 22. AI ACTIVITY LANGUAGE

ECORAA should have a recognizable activity language.

### Idle

Almost invisible.

### Thinking / Planning

Subtle activity.

### Executing

Clear progress.

### Completed

Quiet confirmation.

Do not use a giant glowing AI orb.

Make intelligence feel alive through **behavior**, not decoration.

---

# 23. MICRO-INTERACTIONS

Design proper states for:

* default
* hover
* pressed
* focused
* selected
* disabled
* loading
* success
* error
* AI working
* AI waiting
* AI completed
* disconnected
* reconnecting

These details are mandatory for the premium feel.

---

# 24. REQUIRED PRODUCT AREAS

Eventually design the complete visual system for:

1. Command Center
2. AI Assistant
3. Workspaces
4. Files
5. Console
6. Screen Mirror
7. Cases
8. Memory
9. Device Connection
10. Settings
11. Help
12. Command Palette
13. Global Search
14. Onboarding
15. Empty states
16. Loading states
17. Error states
18. Permission / Trust flows

All must feel like one coherent product.

---

# 25. ONBOARDING

Keep onboarding short.

Flow:

**Welcome → Connect → Trust → Ask → Accomplish**

Get the user to their first successful ECORAA interaction quickly.

---

# 26. EMPTY STATES

Do not use generic:

> No data found.

Instead provide useful direction.

Example:

**No active work**

> Tell ECORAA what you want to accomplish.

[ Start a task ]

Every empty state should tell the user what they can do next.

---

# 27. SETTINGS

Settings should be calm and structured.

Categories:

* General
* Appearance
* AI
* Memory
* Devices
* Permissions
* Security
* Notifications
* Connections
* About

Do not turn Settings into a dashboard.

---

# 28. RESPONSIVE DESIGN

Support:

* phone
* tablet
* laptop
* desktop
* large monitor

Do not simply scale the same layout.

Adapt hierarchy and composition intelligently while maintaining the ECORAA visual identity.

---

# 29. DESIGN REVIEW

Before considering any screen complete, critically review it.

Ask:

* Does this look like a template?
* Is there too much UI?
* Are there too many cards?
* Are there too many borders?
* Are there too many icons?
* Is the glass effect excessive?
* Is the typography strong enough?
* Is the primary action obvious?
* Is there enough whitespace?
* Does it feel calm?
* Does it feel premium?
* Does it feel coherent with ECORAA?
* Can anything be removed?

If yes:

**simplify it.**

---

# 30. IMPLEMENTATION ORDER

Do NOT build all screens simultaneously.

First establish:

1. Application shell
2. Navigation
3. Command Center
4. Typography
5. Icon system
6. Buttons
7. Inputs
8. Glass/material system
9. Motion
10. Command Palette

Then propagate the established design language to:

* Assistant
* Workspaces
* Files
* Console
* Screen Mirror
* Cases
* Memory
* Settings
* Help

---

# 31. VISUAL QA

For every major screen:

```text
Implement
↓
Run
↓
Screenshot
↓
Inspect visually
↓
Compare against design direction
↓
Identify inconsistencies
↓
Refine
↓
Repeat
```

Do not consider a screen complete simply because it compiles.

---

# 32. IMPORTANT ARCHITECTURE RULE

Do not damage the existing application architecture.

Keep:

```text
Flutter UI
    ↓
Bloc / Application Logic
    ↓
Services
    ↓
REST / WebSocket
    ↓
Python Backend
```

Do not put backend logic inside widgets.

Do not put networking directly inside presentation widgets.

Do not rewrite the Python intelligence layer for UI purposes.

---

# 33. FINAL DESIGN PRINCIPLE

Do not optimize for:

> "How much UI can I put on this screen?"

Optimize for:

> **"How little UI can I use while making the product dramatically more powerful?"**

ECORAA should feel:

**simple on the surface
powerful underneath.**

The sophistication should come from:

**Typography

* whitespace
* iconography
* material
* hierarchy
* motion
* interaction
* restraint**

Not from decoration.

---

# EXECUTION RULE

Before changing UI:

**LOAD THE UI/UX SKILL → INSPECT THE PROJECT → UNDERSTAND THE CURRENT ARCHITECTURE → ESTABLISH ECORAA'S DESIGN SYSTEM → DESIGN THE SHELL + COMMAND CENTER → VALIDATE → THEN EXPAND.**

Do not blindly start generating screens.

Do not use generic UI templates.

Do not introduce visual elements simply because AI-generated interfaces commonly use them.

Build ECORAA as a **coherent premium product**, not a collection of screens.

The final experience should feel so coherent that every screen clearly belongs to ECORAA.
