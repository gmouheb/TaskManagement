export const STORAGE_KEYS = {
  tasks: "serene-interval:tasks",
  history: "serene-interval:history",
  settings: "serene-interval:settings",
};

export const defaultSettings = {
  durations: {
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  },
  autoStartBreaks: true,
  autoStartFocus: false,
  darkMode: false,
  soundEnabled: true,
  soundTone: "Gentle Chime",
  alarmVolume: 70,
};

export const durationLimits = {
  focus: { min: 1, max: 240 },
  shortBreak: { min: 1, max: 20 },
  longBreak: { min: 1, max: 60 },
};

export const defaultTasks = [
  {
    id: "task-ui-system",
    title: "Deep Work: UI Design System",
    priority: "high",
    estimatedPoms: 4,
    completedPoms: 1,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-docs",
    title: "Design System Documentation",
    priority: "medium",
    estimatedPoms: 2,
    completedPoms: 0,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-weekly",
    title: "Plan weekly focus blocks",
    priority: "low",
    estimatedPoms: 1,
    completedPoms: 1,
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

export function loadFromStorage(key, fallback) {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Persistence is helpful but not critical to the timer experience.
  }
}

export function loadArrayFromStorage(key, fallback) {
  const value = loadFromStorage(key, fallback);
  return Array.isArray(value) ? value : fallback;
}

export function loadSettingsFromStorage() {
  const value = loadFromStorage(STORAGE_KEYS.settings, defaultSettings);
  const savedSettings = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const savedDurations =
    savedSettings.durations && typeof savedSettings.durations === "object" && !Array.isArray(savedSettings.durations)
      ? savedSettings.durations
      : {};

  const durations = Object.fromEntries(
    Object.entries(defaultSettings.durations).map(([key, defaultValue]) => {
      const limit = durationLimits[key];
      const savedValue = Number(savedDurations[key]);
      const valueToUse = Number.isFinite(savedValue) ? savedValue : defaultValue;
      return [key, Math.min(limit.max, Math.max(limit.min, Math.round(valueToUse)))];
    })
  );

  return {
    ...defaultSettings,
    ...savedSettings,
    durations,
  };
}

function isRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

export function loadTasksFromStorage() {
  const tasks = loadArrayFromStorage(STORAGE_KEYS.tasks, defaultTasks)
    .filter(isRecord)
    .map((task, index) => ({
      id: typeof task.id === "string" ? task.id : `task-saved-${index}`,
      title: typeof task.title === "string" && task.title.trim() ? task.title : "Untitled task",
      priority: ["low", "medium", "high"].includes(task.priority) ? task.priority : "medium",
      estimatedPoms: Number.isFinite(Number(task.estimatedPoms)) ? Number(task.estimatedPoms) : 1,
      completedPoms: Number.isFinite(Number(task.completedPoms)) ? Number(task.completedPoms) : 0,
      completed: Boolean(task.completed),
      createdAt: typeof task.createdAt === "string" ? task.createdAt : new Date().toISOString(),
    }));

  return tasks.length ? tasks : defaultTasks;
}

export function loadHistoryFromStorage() {
  return loadArrayFromStorage(STORAGE_KEYS.history, [])
    .filter(isRecord)
    .filter((session) => ["focus", "shortBreak", "longBreak"].includes(session.type))
    .map((session, index) => ({
      id: typeof session.id === "string" ? session.id : `session-saved-${index}`,
      type: session.type,
      durationMinutes: Number.isFinite(Number(session.durationMinutes)) ? Number(session.durationMinutes) : 0,
      completedAt: typeof session.completedAt === "string" ? session.completedAt : new Date().toISOString(),
      taskId: typeof session.taskId === "string" ? session.taskId : undefined,
    }));
}
