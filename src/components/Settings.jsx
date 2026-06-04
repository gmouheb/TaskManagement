import { durationLimits } from "../utils/storage.js";

const tones = ["Gentle Chime", "Soft Breeze", "Morning Mist"];

function Toggle({ label, detail, checked, onChange }) {
  return (
    <label className="toggle-row">
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="toggle-track" aria-hidden="true" />
    </label>
  );
}

function clampDuration(value, min, max) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return min;
  }

  return Math.min(max, Math.max(min, Math.round(numberValue)));
}

function DurationSlider({ label, value, min, max, colorClass, unit = " min", valueLabel = "value", onChange }) {
  const handleChange = (event) => {
    onChange(clampDuration(event.target.value, min, max));
  };

  return (
    <label className="range-row">
      <span>
        <strong>{label}</strong>
        <span className="range-row__value">
          <input
            type="number"
            min={min}
            max={max}
            step="1"
            value={value}
            onChange={handleChange}
            aria-label={`${label} ${valueLabel}`}
          />
          <em className={colorClass}>
            {value}
            {unit}
          </em>
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={handleChange}
      />
    </label>
  );
}

export default function Settings({ settings, onChange, onTestSound }) {
  const updateSetting = (key, value) => onChange({ ...settings, [key]: value });
  const updateDuration = (key, value) =>
    onChange({
      ...settings,
      durations: {
        ...settings.durations,
        [key]: value,
      },
    });

  return (
    <section className="settings-grid">
      <div className="settings-column">
        <article className="panel">
          <div className="panel-title">
            <span className="material-symbols-outlined" aria-hidden="true">
              schedule
            </span>
            <h3>Interval Durations</h3>
          </div>
          <DurationSlider
            label="Focus"
            value={settings.durations.focus}
            min={durationLimits.focus.min}
            max={durationLimits.focus.max}
            colorClass="badge-primary"
            valueLabel="duration in minutes"
            onChange={(value) => updateDuration("focus", value)}
          />
          <DurationSlider
            label="Short Break"
            value={settings.durations.shortBreak}
            min={durationLimits.shortBreak.min}
            max={durationLimits.shortBreak.max}
            colorClass="badge-secondary"
            valueLabel="duration in minutes"
            onChange={(value) => updateDuration("shortBreak", value)}
          />
          <DurationSlider
            label="Long Break"
            value={settings.durations.longBreak}
            min={durationLimits.longBreak.min}
            max={durationLimits.longBreak.max}
            colorClass="badge-tertiary"
            valueLabel="duration in minutes"
            onChange={(value) => updateDuration("longBreak", value)}
          />
        </article>

        <article className="panel">
          <div className="panel-title">
            <span className="material-symbols-outlined" aria-hidden="true">
              tune
            </span>
            <h3>Automation & UI</h3>
          </div>
          <Toggle
            label="Auto-start Breaks"
            detail="Switch to break timer automatically"
            checked={settings.autoStartBreaks}
            onChange={(checked) => updateSetting("autoStartBreaks", checked)}
          />
          <Toggle
            label="Auto-start Focus"
            detail="Begin focus after a break"
            checked={settings.autoStartFocus}
            onChange={(checked) => updateSetting("autoStartFocus", checked)}
          />
          <Toggle
            label="Dark Mode"
            detail="Toggle light or dark interface theme"
            checked={settings.darkMode}
            onChange={(checked) => updateSetting("darkMode", checked)}
          />
        </article>
      </div>

      <aside className="settings-column">
        <article className="panel">
          <div className="panel-title">
            <span className="material-symbols-outlined" aria-hidden="true">
              notifications_active
            </span>
            <h3>Audio Alerts</h3>
          </div>
          <Toggle
            label="Sound Enabled"
            detail="Play a gentle chime when an interval ends"
            checked={settings.soundEnabled}
            onChange={(checked) => updateSetting("soundEnabled", checked)}
          />
          <div className="tone-group" role="radiogroup" aria-label="Sound tone">
            {tones.map((tone) => (
              <button
                key={tone}
                type="button"
                className={settings.soundTone === tone ? "active" : ""}
                onClick={() => updateSetting("soundTone", tone)}
                role="radio"
                aria-checked={settings.soundTone === tone}
                data-tooltip={`Use the ${tone.toLowerCase()} alert tone.`}
              >
                {tone}
              </button>
            ))}
          </div>
          <DurationSlider
            label="Alarm Volume"
            value={settings.alarmVolume}
            min={0}
            max={100}
            unit="%"
            colorClass="badge-primary"
            valueLabel="percentage"
            onChange={(value) => updateSetting("alarmVolume", value)}
          />
          <button
            type="button"
            className="secondary-button"
            onClick={onTestSound}
            data-tooltip="Play the selected alert sound."
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              volume_up
            </span>
            Test Sound
          </button>
        </article>
      </aside>
    </section>
  );
}
