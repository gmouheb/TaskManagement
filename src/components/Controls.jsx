import { getModeLabel } from "../hooks/useTimer.js";

export default function Controls({ isRunning, currentMode, onToggle, onReset, onSkip }) {
  const modeLabel = getModeLabel(currentMode);

  return (
    <div className="timer-controls" aria-label="Timer controls">
      <button
        type="button"
        className="icon-button"
        onClick={onReset}
        aria-label="Reset timer"
        data-tooltip="Reset this interval to its full duration."
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          refresh
        </span>
      </button>
      <button
        type="button"
        className="primary-control"
        onClick={onToggle}
        data-tooltip={isRunning ? "Pause the current interval." : `Start the ${modeLabel.toLowerCase()} interval.`}
      >
        <span className="material-symbols-outlined filled" aria-hidden="true">
          {isRunning ? "pause" : "play_arrow"}
        </span>
        <span>{isRunning ? "Pause" : `Start ${modeLabel}`}</span>
      </button>
      <button
        type="button"
        className="icon-button"
        onClick={onSkip}
        aria-label="Skip current interval"
        data-tooltip="Skip this interval and move to the next one."
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          skip_next
        </span>
      </button>
    </div>
  );
}
