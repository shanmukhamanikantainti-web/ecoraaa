---
name: Precision Workstation
colors:
  surface: '#fbf8ff'
  surface-dim: '#d9d9e8'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2ff'
  surface-container: '#edecfc'
  surface-container-high: '#e7e7f7'
  surface-container-highest: '#e2e1f1'
  on-surface: '#191b26'
  on-surface-variant: '#414752'
  inverse-surface: '#2e303b'
  inverse-on-surface: '#f0efff'
  outline: '#717783'
  outline-variant: '#c1c6d4'
  surface-tint: '#005eb1'
  primary: '#005cad'
  on-primary: '#ffffff'
  primary-container: '#2075d0'
  on-primary-container: '#fefcff'
  inverse-primary: '#a7c8ff'
  secondary: '#5b5d70'
  on-secondary: '#ffffff'
  secondary-container: '#dedef4'
  on-secondary-container: '#606174'
  tertiary: '#595c60'
  on-tertiary: '#ffffff'
  tertiary-container: '#727578'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#004787'
  secondary-fixed: '#e0e1f7'
  secondary-fixed-dim: '#c4c5db'
  on-secondary-fixed: '#181a2a'
  on-secondary-fixed-variant: '#444657'
  tertiary-fixed: '#e0e2e6'
  tertiary-fixed-dim: '#c4c7ca'
  on-tertiary-fixed: '#191c1f'
  on-tertiary-fixed-variant: '#44474a'
  background: '#fbf8ff'
  on-background: '#191b26'
  surface-variant: '#e2e1f1'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.005em
  title-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0em
  body-default:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-medium:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  body-dense:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-default:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 2px
  space-xs: 4px
  space-sm: 8px
  space-md: 12px
  space-base: 16px
  space-lg: 20px
  space-xl: 24px
  space-2xl: 32px
  window-margin: 16px
  panel-gutter: 8px
  table-row-compact: 28px
  table-row-default: 36px
---

## Brand & Style

This design system establishes a high-density, professional desktop workstation experience tailored for mission-critical operations, systems monitoring, and advanced enterprise workflows.

### Brand Personality & Emotional Impact
- **Rigorous & Dependable:** Inspires complete confidence through crisp alignment, structural precision, and predictable interactive states.
- **Instrument-Grade Focus:** Prioritizes operational clarity and dense data comprehension over decorative flair. The interface recedes to let mission-critical telemetry, controls, and configuration data take prominence.
- **Modern Industrial Cleanliness:** Channels the tactile discipline of high-end software instruments, balancing a crisp light aesthetic with structural framing.

### Visual Movement
- **Corporate / Modern Precision:** A systematic aesthetic balancing functional white surfaces, cool-tinted structural gray layers, crisp 1px structural framing, and deliberate active state indicators.

## Colors

The color architecture is engineered specifically for high-efficiency workstation computing in bright office and laboratory environments.

### Palette Tokens & Application Rules
- **Primary Accent (`#2F7EDA`):** Reserved strictly for active focal points—primary action triggers, active navigation rails, focused inputs, selected table rows, active tab indicator lines, and indeterminate/determinate progress meters.
- **Main Canvas (`#FAFAFA`):** The master canvas tone. Provides maximum legibility without the eye-fatigue of harsh pure white across wide desktop panels.
- **Secondary Surface (`#EDEFF3`):** Sub-panels, toolbars, sidebar docks, inspection trays, and recessed data grid headers.
- **Elevated Surface (`#FFFFFF`):** Work cards, popovers, context menus, modals, and input form cavities requiring crisp separation from the background.
- **Structural Border & Divider (`#C6D1D7`):** Strict 1px delineations isolating viewport regions, panel splits, and cell grids.
- **Secondary Accent (`#9FA0B5`):** Passive telemetry indicators, auxiliary tags, inactive segmented control dividers, and secondary iconography.
- **Dark Neutral (`#555663`):** Neutral controls, secondary icons, and structural element strokes.

### Typography Contrast Architecture
- **Text Primary (`#1E202A`):** High-contrast, near-black tone reserved for data metrics, column values, active labels, and headings. Exceeds 10:1 contrast ratio against `#FAFAFA` and `#FFFFFF`.
- **Text Secondary (`#555663`):** Structural labels, property keys, inactive tabs, and secondary descriptions. Meets WCAG AA standards.
- **Text Muted (`#8A8C9E`):** Placeholder text, passive metadata, disabled action labels, and shortcut keys.

## Typography

The typographic hierarchy is calibrated for high-density desktop user interfaces where screen real estate and numeric scanning speed are paramount.

### Font Family Selection & Fallbacks
- Primary UI: `Inter`, `Segoe UI`, `system-ui`, `-apple-system`, `sans-serif`.
- Data / Telemetry Values: `JetBrains Mono`, `Consolas`, `monospace` for timestamp columns, memory addresses, port assignments, and device identifiers.

### Typographic Principles
- **Controlled Scale:** The type scale ranges tightly between 10px and 24px, preventing oversized marketing elements from encroaching on operational surfaces.
- **Tabular Figures:** All numeric displays must render with tabular figures (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during high-frequency live data updates.
- **Micro-Labels:** Metadata keys and section badges use `label-default` set to uppercase with loose tracking (`+0.04em`) to establish visual distinction at reduced sizes.

## Layout & Spacing

This design system uses a modular, panel-based desktop layout philosophy rather than an open web page fluid grid.

### Layout Philosophy
- **Multi-Pane Dock Architecture:** Fixed-width primary utility navigation (56px collapsed or 220px expanded), an optional secondary accordion tree/navigation column (240px–320px), a flexible primary canvas workspace (flex: 1), and an expandable right-side inspector/properties drawer (280px–360px).
- **Dense Structural Rhythms:** Based on a strict 4px base increment (`space-xs`), with primary operational gaps defaulting to 8px (`space-sm`) and panel interiors padded to 12px or 16px.
- **Window Frame & Margins:** Edge margins adhere to a compact 16px inset from native application frame boundaries, maximizing horizontal space for analytical tables and split panes.

### Breakpoints & Adaptive Modes
- **Compact Desktop (<1280px):** Inspection sidebars collapse into overlay slide-out drawers; tabular grids prioritize key columns, hiding secondary timestamps into row-expansions.
- **Standard Desktop (1280px – 1919px):** Fully expanded 3-column split view (Nav + Canvas + Context Panel).
- **Ultra-Wide Workstation (>=1920px):** Multi-column canvas splitting enabled (side-by-side node comparisons, concurrent live graphs) without stretching components beyond readability.

## Elevation & Depth

Visual hierarchy is maintained primarily through tonal layering and crisp 1px structural outlines, minimizing shadow blur to retain an engineering-grade aesthetic.

### Depth Layers
1. **Root Stage (Lowest Layer):** `#FAFAFA` canvas background.
2. **Structural Dock & Toolbars:** `#EDEFF3` panels nested directly upon the canvas, framed by a continuous 1px solid `#C6D1D7` border. No drop shadows.
3. **Elevated Content Modules & Cards:** `#FFFFFF` cards resting on `#FAFAFA` or `#EDEFF3`. Outlined by 1px `#C6D1D7` with a subtle elevation offset: `box-shadow: 0 1px 2px 0 rgba(30, 32, 42, 0.04)`.
4. **Active Focus & Selection:** Selection overlays utilize `#2F7EDA` with an 8% alpha wash (`rgba(47, 126, 218, 0.08)`) and a 1px solid `#2F7EDA` perimeter stroke.
5. **Overlays & Floating Sheets:** Modals, context menus, and tooltips take `#FFFFFF` or solid deep neutral backgrounds with sharp, crisp projection: `box-shadow: 0 4px 12px -2px rgba(30, 32, 42, 0.12), 0 1px 3px 0 rgba(30, 32, 42, 0.06)`, framed with a 1px `#C6D1D7` edge.

## Shapes

The design system incorporates an intentional, tight corner radius language (`6px` to `8px`) that balances contemporary window management with compact engineering interfaces.

### Corner Radii Architecture
- **Control & Action Radius (6px):** Used for buttons, text input fields, segmented control pills, select menus, dropdown items, and table selection highlights.
- **Container & Card Radius (8px):** Applied to elevated dashboard cards, inspection containers, modal viewports, dialog surfaces, and docked panels.
- **Tab Indicators & Tags (4px):** Applied to micro status chips, inline badges, and inner toolbar triggers to maintain density without visual softness.
- **Prohibited:** Completely circular or pill-shaped buttons (`radius: 9999px`) are forbidden, as they compromise space efficiency within compact data panels.

## Components

### Buttons
- **Primary:** Background `#2F7EDA`, border transparent, text `#FFFFFF`, font weight 600, height 32px (compact: 28px), radius 6px, horizontal padding 14px. Hover: `#256BBF`. Active: `#1F579C`. Focus: 2px outline in `#2F7EDA` with 2px white offset.
- **Secondary / Neutral:** Background `#FFFFFF`, border 1px solid `#C6D1D7`, text `#1E202A`, font weight 500, height 32px, radius 6px. Hover: background `#EDEFF3`, border `#9FA0B5`. Active: `#E2E5EB`.
- **Ghost / Icon Action:** Background transparent, text `#555663`, radius 6px. Hover: background `#EDEFF3`, text `#1E202A`. Size: 28x28px or 32x32px.

### Input Fields & Select Controls
- **Cavity:** Background `#FFFFFF`, border 1px solid `#C6D1D7`, height 32px, radius 6px, padding 0 10px, text `#1E202A`, placeholder `#8A8C9E`, font size 13px.
- **Interactive States:** Hover border `#9FA0B5`. Focus border `#2F7EDA` with a 2px outer glow `rgba(47, 126, 218, 0.16)`. Error border `#D93D42`.

### Tabs & Segmented Switchers
- **Segmented Control Bar:** Background `#EDEFF3`, padding 2px, radius 6px. Inner items: height 26px, radius 4px, font size 12px, font weight 500, color `#555663`. Selected item: background `#FFFFFF`, color `#1E202A`, shadow `0 1px 2px rgba(0,0,0,0.06)`.
- **Panel Header Tabs:** Horizontal layout bordering `#C6D1D7`. Active tab displays 2px bottom underline in `#2F7EDA` and text `#2F7EDA` (semi-bold). Inactive tab color `#555663`.

### Data Grids & Tables
- **Header Row:** Background `#EDEFF3`, height 32px, border-bottom 1px solid `#C6D1D7`, text `#555663`, font-size 11px, font-weight 600, uppercase with tracking.
- **Row Specs:** Alternating or clean rows on `#FFFFFF` background, height 36px (compact: 28px), border-bottom 1px solid `#EDEFF3`.
- **Selection State:** Row background `#2F7EDA` at 8% opacity, with a 2px solid `#2F7EDA` indicator bar on the left edge.

### Status Chips & Badges
- **Structure:** Height 20px, radius 4px, padding 0 6px, font size 11px, font weight 600.
- **Info / Active:** Background `rgba(47, 126, 218, 0.12)`, text `#2F7EDA`.
- **Neutral:** Background `#EDEFF3`, border 1px solid `#C6D1D7`, text `#555663`.
- **Success:** Background `#E6F5ED`, text `#137A43`.
- **Warning / Alert:** Background `#FFF4E5`, text `#B25900`.
- **Critical:** Background `#FDE8E9`, text `#C5282D`.

### Checkboxes & Radio Elements
- **Checkbox Box:** 16x16px, radius 4px, border 1px solid `#C6D1D7`, background `#FFFFFF`. Checked state: background `#2F7EDA`, border `#2F7EDA`, white checkmark icon.
- **Radio Button:** 16x16px circle, border 1px solid `#C6D1D7`, background `#FFFFFF`. Selected: border `#2F7EDA`, inner dot `#2F7EDA` (6px diameter).

### Workstation Cards & Floating Panels
- **Structure:** Background `#FFFFFF`, border 1px solid `#C6D1D7`, radius 8px, padding 16px.
- **Card Header:** Integrated divider border-bottom 1px solid `#EDEFF3`, bottom padding 10px, top title font size 13px bold `#1E202A`.