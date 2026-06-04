import Controls from "./Controls.jsx";
import { getModeLabel } from "../hooks/useTimer.js";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function modeClass(mode) {
  return mode === "focus" ? "is-focus" : "is-break";
}

export default function Timer({
  timer,
  activeTask,
  stats,
  onSelectMode,
  onToggle,
  onReset,
  onSkip,
}) {
  const progress = timer.totalTime > 0 ? timer.timeLeft / timer.totalTime : 0;
  const circumference = 301.6;
  const dashOffset = circumference - progress * circumference;

  return (
    <section className={`timer-view ${modeClass(timer.currentMode)}`}>
      <div className="mode-switcher" role="tablist" aria-label="Timer mode">
        {["focus", "shortBreak", "longBreak"].map((mode) => (
          <button
            key={mode}
            type="button"
            className={timer.currentMode === mode ? "active" : ""}
            onClick={() => onSelectMode(mode)}
            aria-selected={timer.currentMode === mode}
            role="tab"
            data-tooltip={`Switch to ${getModeLabel(mode).toLowerCase()} mode.`}
          >
            {getModeLabel(mode)}
          </button>
        ))}
      </div>

      <div className="timer-hero" aria-label={`${getModeLabel(timer.currentMode)} timer`}>
        <svg className="timer-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="timer-ring__track" cx="50" cy="50" r="48" />
          <circle
            className="timer-ring__progress"
            cx="50"
            cy="50"
            r="48"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="timer-face">
          <span className="timer-time">{formatTime(timer.timeLeft)}</span>
          <p className="label-caps">Current Task</p>
          <h2>{activeTask?.title || "Choose a task to focus on"}</h2>
        </div>
      </div>

      <Controls
        isRunning={timer.isRunning}
        currentMode={timer.currentMode}
        onToggle={onToggle}
        onReset={onReset}
        onSkip={onSkip}
      />

      <div className="metric-grid">
        <article className="metric-card">
          <span className="material-symbols-outlined metric-card__icon icon-primary" aria-hidden="true">
            bolt
          </span>
          <h3>Focus Sessions</h3>
          <p>{stats.todayFocus} Today</p>
        </article>
        <article className="metric-card">
          <span className="material-symbols-outlined metric-card__icon icon-secondary" aria-hidden="true">
            schedule
          </span>
          <h3>Total Focus Time</h3>
          <p>{stats.totalFocusLabel}</p>
        </article>
        <article className="metric-card">
          <span className="material-symbols-outlined metric-card__icon icon-tertiary" aria-hidden="true">
            local_fire_department
          </span>
          <h3>Current Streak</h3>
          <p>{stats.streak} Days</p>
        </article>
      </div>
    </section>
  );
}
