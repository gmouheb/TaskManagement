# Implementation Plan: Serene Interval (React Pomodoro App)

This document outlines the step-by-step implementation plan for building the **Serene Interval** Pomodoro Focus Timer and Task Management application using React, Vite, and Tailwind CSS. The design adheres strictly to the calm-tech philosophy and aesthetics defined in `DESIGN.md`.

---

## 1. Technical Stack & Dependencies

*   **Build Tool:** Vite (for fast, lightweight React development)
*   **Core Library:** React (Functional components with Hooks)
*   **Styling:** Tailwind CSS (matching the utility classes used in the Stitch mockups)
*   **Icons:** Material Symbols Outlined (loaded via Google Fonts)
*   **Fonts:** Manrope & Inter (loaded via Google Fonts)
*   **State Management:** React Context API + local component state (lightweight, no external state libraries needed)
*   **Persistence:** `localStorage` for tasks, session history, and settings
*   **Audio Alerts:** Web Audio API (Synthesizing a gentle chime tone to avoid external asset dependency problems)

---

## 2. File & Directory Structure

```
/home/mouheb/TaskManagement/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navigation/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Header.jsx
│   │   ├── Timer/
│   │   │   ├── TimerDisplay.jsx
│   │   │   ├── TimerControls.jsx
│   │   │   └── ModeSwitcher.jsx
│   │   ├── Tasks/
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── TaskInput.jsx
│   │   ├── Analytics/
│   │   │   ├── MetricCards.jsx
│   │   │   └── ActivityChart.jsx
│   │   └── Settings/
│   │       ├── DurationSliders.jsx
│   │       ├── PreferenceToggles.jsx
│   │       └── AudioSettings.jsx
│   ├── context/
│   │   ├── AppStateContext.jsx
│   │   └── TimerContext.jsx
│   ├── utils/
│   │   ├── audio.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
├── DESIGN.md
└── IMPLEMENTATION_PLAN.md
```

---

## 3. Data Schema & State Management

### A. AppStateContext
Manages user preferences, task lists, and session logs.

```javascript
// Tasks State Schema
const taskSchema = {
  id: "string (uuid)",
  title: "string",
  priority: "low" | "medium" | "high",
  estimatedPoms: 4,
  completedPoms: 2,
  completed: false,
  createdAt: "ISOString"
};

// Completed Sessions Log Schema
const sessionSchema = {
  id: "string (uuid)",
  type: "focus" | "short-break" | "long-break",
  durationMinutes: 25,
  completedAt: "ISOString",
  taskId: "string (optional)" // Associated task
};

// Settings State Schema
const settingsSchema = {
  durations: {
    focus: 25, // in minutes
    shortBreak: 5,
    longBreak: 15
  },
  autoStartBreaks: true,
  autoStartFocus: false,
  darkMode: false,
  soundEnabled: true,
  soundTone: "Gentle Chime" | "Soft Breeze" | "Morning Mist",
  alarmVolume: 75 // 0 to 100
};
```

### B. TimerContext
Manages active timer ticking and progress state.

```javascript
const timerState = {
  timeLeft: 1500, // seconds
  totalTime: 1500, // seconds
  isRunning: false,
  currentMode: "focus" | "short-break" | "long-break",
  activeTaskId: "string (optional)"
};
```

---

## 4. Phase-by-Phase Development Plan

### Phase 1: Project Initialization & Configuration
1.  Initialize a new Vite project in the current directory using `npm` and React.
2.  Install Tailwind CSS and configure `tailwind.config.js` to match the exact custom colors, spacing, typography, and border radius rules from `DESIGN.md`.
3.  Set up Google Fonts imports in `src/index.css` (Manrope, Inter, and Material Symbols Outlined).
4.  Configure dark/light theme triggers at the HTML element level.

### Phase 2: Contexts & Audio Utils
1.  Implement `AppStateContext` to manage tasks, history, and settings with `localStorage` hooks.
2.  Implement `TimerContext` to handle countdown logic with a unified interval ticker, auto-start transitions, and callback notifications when sessions conclude.
3.  Write `src/utils/audio.js` using the Web Audio API to synthesize focus-complete tones (e.g. gentle chimes) using oscillators, avoiding the need for sound file assets.

### Phase 3: Layout & Shell Components
1.  **Sidebar:** Responsive drawer with tabs (Timer, Tasks, Analytics, Settings), logo container, and user profile display.
2.  **Header:** Top bar containing the page title, user account trigger, and inline notifications.
3.  Create the navigation routing system (managed via page tabs in context state for simple single-page-app view rendering).

### Phase 4: Timer View (Core Screen)
1.  **Mode Switcher:** Capsule design component with spring transitions between Focus/Short Break/Long Break.
2.  **Timer SVG Ring:** A dynamic SVG countdown indicator utilizing CSS dashoffset.
3.  **Timer Controls:** Pill start/pause button, circular reset and skip controls.
4.  **Bento Metrics Bar:** Display session analytics (Focus sessions today, total focus time, current streak).

### Phase 5: Task Management View
1.  **Task List & Item Component:** Checkbox functionality, custom priority badges (High, Medium, Low), and action menus.
2.  **New Task Input Card:** Control input, priority select dropdown, and Pomodoro target incrementer.
3.  Include a simple list drag-and-drop or re-order feature.
4.  Implement in-page alert notifications (Toast popups) and state transformations (completion opacity/strike-through) when tasks are done.

### Phase 6: Settings View
1.  Duration slider components for Focus, Short Break, and Long Break configurations.
2.  Automation and UI toggle switches (Auto-start breaks, auto-start focus, Dark Mode switch).
3.  Alert Tone picker buttons and Volume control range sliders.

### Phase 7: Analytics View & History Display
1.  Metric Cards summarizing total productivity stats.
2.  **Weekly Activity Chart:** A customized SVG/CSS-based vertical bar graph showing cumulative focus hours per day.
3.  **Recent Successes List:** Displaying recently completed tasks and focus sessions with timestamp tags.

---

## 5. UI States & Validation Checklist

*   [ ] **Timer Transition:** State matches current activity (Focus state Sage Green tint, Break states Slate Blue tint).
*   [ ] **Persistence:** Refreshing the page retains settings, current active tasks, and historical session logs.
*   [ ] **Sound Synthesis:** Audio synthesizers fire correctly upon session completion.
*   [ ] **Responsive layout:** View scales appropriately between mobile widths (< 768px) and desktop (> 1200px).
*   [ ] **Dark Mode:** Toggling dark mode instantly switches themes across all components.
*   [ ] **Toast Alerts:** End-of-session alerts block/notify within the viewport.
