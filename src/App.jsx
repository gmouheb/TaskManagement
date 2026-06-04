import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Timer from "./components/Timer.jsx";
import PageAlert from "./components/PageAlert.jsx";
import SessionHistory from "./components/SessionHistory.jsx";
import Settings from "./components/Settings.jsx";
import { useTimer, getModeLabel } from "./hooks/useTimer.js";
import { playSessionSound } from "./utils/sound.js";
import {
  STORAGE_KEYS,
  loadHistoryFromStorage,
  loadSettingsFromStorage,
  loadTasksFromStorage,
  saveToStorage,
} from "./utils/storage.js";

const pages = [
  { id: "timer", label: "Timer", icon: "timer", title: "Dashboard" },
  { id: "tasks", label: "Tasks", icon: "checklist", title: "Task Management" },
  { id: "analytics", label: "Analytics", icon: "analytics", title: "Analytics" },
  { id: "settings", label: "Settings", icon: "settings", title: "Settings" },
];

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sameDay(firstDate, secondDate) {
  return firstDate.toDateString() === secondDate.toDateString();
}

function minutesLabel(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

function calculateStreak(history) {
  const focusDays = new Set(
    history
      .filter((session) => session.type === "focus")
      .map((session) => new Date(session.completedAt).toDateString())
  );

  let streak = 0;
  const cursor = new Date();

  while (focusDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getWeekActivity(history) {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - index));
    const minutes = history
      .filter((session) => session.type === "focus" && sameDay(new Date(session.completedAt), day))
      .reduce((total, session) => total + session.durationMinutes, 0);

    return {
      label: day.toLocaleDateString(undefined, { weekday: "short" }),
      minutes,
    };
  });
}

function Sidebar({ activePage, onPageChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <h1>Serene Interval</h1>
        <p>Focusing...</p>
      </div>
      <nav className="nav-list" aria-label="Primary">
        {pages.map((page) => (
          <button
            key={page.id}
            type="button"
            className={activePage === page.id ? "active" : ""}
            onClick={() => onPageChange(page.id)}
            data-tooltip={`Open the ${page.label.toLowerCase()} page.`}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {page.icon}
            </span>
            <span>{page.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Header({ title, onOpenSettings }) {
  return (
    <header className="topbar">
      <h2>{title}</h2>
      <div className="topbar-actions">
        <button
          type="button"
          className="icon-button icon-button--small"
          aria-label="Notifications"
          data-tooltip="View recent timer notifications."
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            notifications
          </span>
        </button>
        <button
          type="button"
          className="icon-button icon-button--small"
          onClick={onOpenSettings}
          aria-label="Account settings"
          data-tooltip="Open settings."
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            account_circle
          </span>
        </button>
      </div>
    </header>
  );
}

function TimerFinishedPopup({ session, onClose, onOpenTimer }) {
  if (!session) {
    return null;
  }

  const isFocus = session.type === "focus";

  return (
    <div className="popup-backdrop" role="presentation">
      <section className="finish-popup" role="dialog" aria-modal="true" aria-labelledby="finish-popup-title">
        <div className="finish-popup__icon">
          <span className="material-symbols-outlined" aria-hidden="true">
            {isFocus ? "task_alt" : "spa"}
          </span>
        </div>
        <div>
          <p className="label-caps">{getModeLabel(session.type)} Finished</p>
          <h2 id="finish-popup-title">Timer finished</h2>
          <p>
            {isFocus
              ? "Nice work. Your focus interval is complete, and it is time for a mindful pause."
              : "Your break is complete. You can return to focus when you are ready."}
          </p>
        </div>
        <div className="finish-popup__actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
            data-tooltip="Close this pop-up."
          >
            Close
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={onOpenTimer}
            data-tooltip="Close this pop-up and show the timer."
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              timer
            </span>
            View Timer
          </button>
        </div>
      </section>
    </div>
  );
}

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [estimatedPoms, setEstimatedPoms] = useState(2);
  const [priority, setPriority] = useState("medium");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    onAdd({
      title: trimmedTitle,
      estimatedPoms,
      priority,
    });
    setTitle("");
    setEstimatedPoms(2);
    setPriority("medium");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        id="task-input"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What are we focusing on next?"
      />
      <div className="task-form__controls">
        <label>
          <span>Poms</span>
          <div className="stepper">
            <button
              type="button"
              onClick={() => setEstimatedPoms((value) => Math.max(1, value - 1))}
              aria-label="Reduce pomodoros"
              data-tooltip="Use one fewer pomodoro for this task."
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                remove
              </span>
            </button>
            <strong>{estimatedPoms}</strong>
            <button
              type="button"
              onClick={() => setEstimatedPoms((value) => Math.min(12, value + 1))}
              aria-label="Increase pomodoros"
              data-tooltip="Add one more pomodoro to this task."
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                add
              </span>
            </button>
          </div>
        </label>
        <label>
          <span>Priority</span>
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <button type="submit" className="primary-button" data-tooltip="Add this task to your focus list.">
          <span className="material-symbols-outlined" aria-hidden="true">
            add
          </span>
          Add
        </button>
      </div>
    </form>
  );
}

function TaskList({ tasks, selectedTaskId, onAdd, onToggle, onDelete, onSelect }) {
  return (
    <section className="tasks-view">
      <div className="page-intro">
        <div>
          <p className="label-caps">Active Focus</p>
          <h2>Organize your flow.</h2>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => document.getElementById("task-input")?.focus()}
          data-tooltip="Jump to the new task field."
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            add
          </span>
          New Task
        </button>
      </div>

      <TaskForm onAdd={onAdd} />

      <div className="task-list">
        {tasks.map((task) => (
          <article
            key={task.id}
            className={`task-card ${task.completed ? "is-complete" : ""} ${selectedTaskId === task.id ? "is-selected" : ""}`}
          >
            <span className="material-symbols-outlined drag-handle" aria-hidden="true">
              drag_indicator
            </span>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              aria-label={`Mark ${task.title} complete`}
            />
            <button
              type="button"
              className="task-card__body"
              onClick={() => onSelect(task.id)}
              data-tooltip={`Set "${task.title}" as the active focus task.`}
            >
              <strong>{task.title}</strong>
              <span>
                <em className={`priority priority--${task.priority}`}>{task.priority}</em>
                <small>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    timer
                  </span>
                  {task.completedPoms} / {task.estimatedPoms} Poms
                </small>
              </span>
            </button>
            <div className="task-card__actions">
              <button
                type="button"
                className="icon-button icon-button--small"
                onClick={() => onSelect(task.id)}
                aria-label={`Focus ${task.title}`}
                data-tooltip="Make this the active focus task."
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  target
                </span>
              </button>
              <button
                type="button"
                className="icon-button icon-button--small danger"
                onClick={() => onDelete(task.id)}
                aria-label={`Delete ${task.title}`}
                data-tooltip="Delete this task."
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  delete
                </span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Analytics({ stats, history, tasks }) {
  const maxMinutes = Math.max(60, ...stats.weekActivity.map((day) => day.minutes));

  return (
    <section className="analytics-view">
      <div className="metric-grid analytics-metrics">
        <article className="metric-card">
          <span className="material-symbols-outlined metric-card__icon icon-primary" aria-hidden="true">
            schedule
          </span>
          <h3>Total Focus Time</h3>
          <p>{stats.totalFocusLabel}</p>
        </article>
        <article className="metric-card">
          <span className="material-symbols-outlined metric-card__icon icon-tertiary" aria-hidden="true">
            verified
          </span>
          <h3>Pomodoros Done</h3>
          <p>{stats.focusSessions}</p>
        </article>
        <article className="metric-card">
          <span className="material-symbols-outlined metric-card__icon icon-secondary" aria-hidden="true">
            bolt
          </span>
          <h3>Daily Streak</h3>
          <p>{stats.streak} Days</p>
        </article>
      </div>

      <section className="chart-panel">
        <div className="section-heading">
          <div>
            <h3>Weekly Activity</h3>
            <p>Hours spent in focus sessions</p>
          </div>
          <div className="segmented-control">
            <button type="button" className="active" data-tooltip="Show this week's focus activity.">
              Week
            </button>
            <button type="button" data-tooltip="Monthly view is not active yet.">
              Month
            </button>
          </div>
        </div>
        <div className="bar-chart">
          {stats.weekActivity.map((day) => (
            <div className="bar-column" key={day.label}>
              <div className="bar-track">
                <div className="bar-fill" style={{ height: `${Math.max(4, (day.minutes / maxMinutes) * 100)}%` }} />
              </div>
              <span>{day.label}</span>
            </div>
          ))}
        </div>
      </section>

      <SessionHistory history={history} tasks={tasks} />
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("timer");
  const [tasks, setTasks] = useState(loadTasksFromStorage);
  const [history, setHistory] = useState(loadHistoryFromStorage);
  const [settings, setSettings] = useState(loadSettingsFromStorage);
  const [selectedTaskId, setSelectedTaskId] = useState(() => tasks.find((task) => !task.completed)?.id || tasks[0]?.id);
  const [alert, setAlert] = useState(null);
  const [finishPopup, setFinishPopup] = useState(null);

  useEffect(() => saveToStorage(STORAGE_KEYS.tasks, tasks), [tasks]);
  useEffect(() => saveToStorage(STORAGE_KEYS.history, history), [history]);
  useEffect(() => saveToStorage(STORAGE_KEYS.settings, settings), [settings]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  useEffect(() => {
    if (!alert) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setAlert(null), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [alert]);

  const activeTask = useMemo(() => {
    const selectedTask = tasks.find((task) => task.id === selectedTaskId && !task.completed);
    return selectedTask || tasks.find((task) => !task.completed) || tasks[0];
  }, [selectedTaskId, tasks]);

  const handleSessionComplete = useCallback(
    (type, durationMinutes) => {
      const session = {
        id: createId("session"),
        type,
        durationMinutes,
        completedAt: new Date().toISOString(),
        taskId: type === "focus" ? activeTask?.id : undefined,
      };

      setHistory((currentHistory) => [session, ...currentHistory].slice(0, 80));

      if (type === "focus" && activeTask?.id) {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === activeTask.id
              ? {
                  ...task,
                  completedPoms: Math.min(task.estimatedPoms, task.completedPoms + 1),
                  completed: task.completedPoms + 1 >= task.estimatedPoms,
                }
              : task
          )
        );
      }

      playSessionSound({
        enabled: settings.soundEnabled,
        tone: settings.soundTone,
        volume: settings.alarmVolume,
      });

      setAlert({
        type: "success",
        icon: type === "focus" ? "task_alt" : "spa",
        message: `${getModeLabel(type)} complete. ${type === "focus" ? "Time for a mindful pause." : "Ready when you are."}`,
      });
      setFinishPopup(session);
    },
    [activeTask, settings]
  );

  const timer = useTimer(settings, handleSessionComplete);

  const stats = useMemo(() => {
    const today = new Date();
    const focusSessions = history.filter((session) => session.type === "focus");
    const todayFocus = focusSessions.filter((session) => sameDay(new Date(session.completedAt), today)).length;
    const totalFocusMinutes = focusSessions.reduce((total, session) => total + session.durationMinutes, 0);

    return {
      focusSessions: focusSessions.length,
      todayFocus,
      totalFocusLabel: minutesLabel(totalFocusMinutes),
      streak: calculateStreak(history),
      weekActivity: getWeekActivity(history),
    };
  }, [history]);

  const addTask = (taskInput) => {
    const task = {
      id: createId("task"),
      title: taskInput.title,
      priority: taskInput.priority,
      estimatedPoms: taskInput.estimatedPoms,
      completedPoms: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((currentTasks) => [task, ...currentTasks]);
    setSelectedTaskId(task.id);
    setAlert({ type: "success", icon: "add_task", message: "Task added to your focus list." });
  };

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
  };

  const deleteTask = (taskId) => {
    setTasks((currentTasks) => {
      const nextTasks = currentTasks.filter((task) => task.id !== taskId);

      if (selectedTaskId === taskId) {
        setSelectedTaskId(nextTasks.find((task) => !task.completed)?.id || nextTasks[0]?.id);
      }

      return nextTasks;
    });
  };

  const activeTitle = pages.find((page) => page.id === activePage)?.title || "Dashboard";

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <div className="app-content">
        <Header title={activeTitle} onOpenSettings={() => setActivePage("settings")} />
        <main className="main-canvas">
          {activePage === "timer" && (
            <Timer
              timer={timer}
              activeTask={activeTask}
              stats={stats}
              onSelectMode={timer.selectMode}
              onToggle={timer.toggleRunning}
              onReset={timer.reset}
              onSkip={timer.skip}
            />
          )}

          {activePage === "tasks" && (
            <TaskList
              tasks={tasks}
              selectedTaskId={activeTask?.id}
              onAdd={addTask}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onSelect={setSelectedTaskId}
            />
          )}

          {activePage === "analytics" && <Analytics stats={stats} history={history} tasks={tasks} />}

          {activePage === "settings" && (
            <Settings
              settings={settings}
              onChange={setSettings}
              onTestSound={() =>
                playSessionSound({
                  enabled: settings.soundEnabled,
                  tone: settings.soundTone,
                  volume: settings.alarmVolume,
                })
              }
            />
          )}
        </main>
      </div>
      <PageAlert alert={alert} onDismiss={() => setAlert(null)} />
      <TimerFinishedPopup
        session={finishPopup}
        onClose={() => setFinishPopup(null)}
        onOpenTimer={() => {
          setFinishPopup(null);
          setActivePage("timer");
        }}
      />
    </div>
  );
}
