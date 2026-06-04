# Design System: Serene Interval

"Serene Interval" is a design system centered on the **"Calm Tech"** philosophy—creating technology that respects human attention, minimizes cognitive load, and promotes mindfulness. It is designed specifically for a Pomodoro focus and productivity application.

---

## 1. Color Palette

The color system is built around low-chroma, organic tones to reduce eye strain and establish a peaceful, productive environment.

### Primary Colors
*   **Primary (Sage Green):** `#476550` (used for active focus state, primary buttons, highlights)
*   **Primary Container:** `#7d9d85` (softer sage green for container states)
*   **On-Primary:** `#ffffff` (text/icons on primary backgrounds)
*   **On-Primary-Container:** `#173422`
*   **Inverse-Primary:** `#adcfb5`

### Secondary Colors
*   **Secondary (Slate Blue):** `#4d6072` (used for rest states, secondary navigation, and grounding elements)
*   **Secondary Container:** `#cee2f6`
*   **On-Secondary:** `#ffffff`
*   **On-Secondary-Container:** `#526576`

### Tertiary Colors
*   **Tertiary (Muted Terracotta):** `#a23e26` (reserved strictly for destructive actions, "Stop" states, or alerts)
*   **Tertiary Container:** `#e87356`
*   **On-Tertiary:** `#ffffff`
*   **On-Tertiary-Container:** `#5d1000`

### Neutral & Surface Colors
*   **Background / Surface:** `#f8faf8` (soft off-white to prevent glare)
*   **Surface Bright:** `#f8faf8`
*   **Surface Dim:** `#d8dad9`
*   **Surface Container Lowest:** `#ffffff` (pure white for card backgrounds to establish hierarchy)
*   **Surface Container Low:** `#f2f4f2`
*   **Surface Container:** `#eceeec`
*   **Surface Container High:** `#e6e9e7`
*   **Surface Container Highest:** `#e1e3e1`
*   **On-Surface:** `#191c1b`
*   **On-Surface-Variant:** `#424843`
*   **Inverse Surface:** `#2e3130`
*   **Inverse On-Surface:** `#eff1ef`
*   **Outline:** `#727972`
*   **Outline Variant:** `#c2c8c1`

---

## 2. Typography

The system uses two font families: **Manrope** for large, geometric numbers and headers, and **Inter** for clean, readable interface elements.

| Font Style | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Timer (Desktop)** | Manrope | 120px | 200 (Light) | 120px | `-0.04em` | Main countdown timer |
| **Display Timer (Mobile)** | Manrope | 80px | 200 (Light) | 80px | `-0.04em` | Main countdown timer on mobile |
| **Headline Large** | Manrope | 32px | 600 (Semibold) | 40px | Default | Page-level major headings |
| **Headline Medium** | Manrope | 24px | 500 (Medium) | 32px | Default | Card titles, navigation header |
| **Body Large** | Inter | 18px | 400 (Regular) | 28px | Default | Inputs, main descriptive text |
| **Body Medium** | Inter | 16px | 400 (Regular) | 24px | Default | Default UI text, secondary info |
| **Label Caps** | Inter | 12px | 600 (Semibold) | 16px | `0.1em` (Uppercase) | Uppercase trackers, small tags |

---

## 3. Spacing & Grid System

Spacing scale is based on an **8px base unit** to ensure consistency.

*   **xs (Extra Small):** 4px
*   **base (Small):** 8px
*   **sm (Medium-Small):** 12px
*   **md (Medium):** 24px
*   **lg (Large):** 48px
*   **xl (Extra Large):** 80px
*   **container-max:** 1200px (maximum width of center canvas)

---

## 4. Border Radius (Rounding)

*   **DEFAULT / sm:** `0.25rem` (4px) — Small pills, badges, inputs
*   **lg:** `0.5rem` (8px) — Buttons, small cards, select fields
*   **xl:** `0.75rem` (12px) — Main cards, navigation panels (Note: *Design MD suggests up to 1.5rem/24px for large dashboard containers*)
*   **full:** `9999px` — Toggles, progress pills, circular buttons, avatar containers

---

## 5. Elevation & Shadows

The system uses soft, diffused shadows with green and blue tints to create a gentle sense of depth.

*   **Sage Soft Elevation (Focus Cards/Timer):**
    `box-shadow: 0 10px 30px -10px rgba(71, 101, 80, 0.08)`
*   **Slate Soft Elevation (Task Cards):**
    `box-shadow: 0 10px 30px rgba(77, 96, 114, 0.04)`
*   **Hover/Active Elevation:**
    `box-shadow: 0 15px 40px rgba(77, 96, 114, 0.08)`

---

## 6. Layout & Screen Structure

All screens share a persistent structural layout to provide a unified desktop application experience.

1.  **Sidebar Navigation (`aside`):**
    *   Width: `64` (256px), fixed to the left.
    *   Background: `bg-surface-container-low` (light mode) or `bg-surface-container-lowest` (dark mode).
    *   Contains the product title, nav links with active state indicators, and a profile card at the bottom.
2.  **Top App Bar (`header`):**
    *   Height: `16` (64px), sticky to the top.
    *   Background: translucent surface with a backdrop blur (`bg-surface/80 backdrop-blur-md`).
    *   Margins: Offset by `ml-64` to clear the sidebar.
    *   Contains the screen title and utility icon buttons (notifications, profile).
3.  **Main Content Canvas (`main`):**
    *   Margins: Offset by `ml-64` to clear the sidebar.
    *   Padding: Large container margins (`p-lg`).
    *   Centering: Inner container has `max-w-[1200px] mx-auto` to center content with ample whitespace.

---

## 7. Key Components

### Mode Switcher (Focus/Short Break/Long Break)
*   An inline-flex pill container (`bg-surface-container-low`, padded).
*   Contains three capsule buttons.
*   **Active button:** `bg-primary text-on-primary` with smooth scaling transition.
*   **Inactive buttons:** `text-on-surface-variant` with a soft hover scale.

### Timer Display & Ring
*   Centered SVG progress ring with `timer-progress-ring` transition (`stroke-dasharray="301.6"`).
*   Timer text uses `font-display-timer`.
*   Displays the active task title immediately below the timer.

### Control Buttons
*   **Play/Pause:** Large pill button, primary color `bg-primary text-on-primary`, text "Start Focus" / "Pause".
*   **Reset/Skip:** Circular buttons, outline style `border-outline-variant`, hover border transitions to `border-primary`.

### Task Card
*   A rounded-xl white card (`bg-white border-outline-variant/20 shadow-soft`).
*   Contains a drag indicator handle (`drag_indicator`), rounded circular checkbox, task text, priority indicator badge (High = Muted Terracotta, Medium = Sage Green, Low = Slate Blue), pomodoro countdown badge, and action items (Edit, Delete) visible on hover.

### Bento Grid Cards (Metrics/Stats)
*   Boxes with `bg-surface-container-lowest`, `soft-elevation`, padded, displaying key statistics (Focus Sessions, Total Focus Time, Streak).

### Charts (Weekly Activity)
*   A bar chart where progress bars rise from the bottom of an organic track (`bg-primary-fixed-dim/20`) using custom CSS transitions (`transition: height 1s cubic-bezier(0.4, 0, 0.2, 1)`).

---

## 8. UI States & Micro-interactions

*   **Active/Running State:** The timer ring decreases clockwise. Controls change from "Start Focus" (play icon) to "Pause" (pause icon).
*   **Task Completion:** Checking a task card reduces its opacity to `60%`, adds a line-through to the header, removes the shadow, and sets the background to `bg-surface-container-low/50`.
*   **Hover states:** Sidebar links change background with `hover:bg-surface-variant/50`. Task cards lift slightly on hover (`hover:-translate-y-1 transition-all duration-300`).
*   **Dark Mode Support:** Configured via Tailwind CSS `darkMode: "class"`. Main layout changes backgrounds to `bg-surface-container-lowest` and text to appropriate high-contrast variants.
