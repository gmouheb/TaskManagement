export default function PageAlert({ alert, onDismiss }) {
  if (!alert) {
    return null;
  }

  return (
    <div className={`page-alert page-alert--${alert.type || "success"}`} role="status">
      <span className="material-symbols-outlined" aria-hidden="true">
        {alert.icon || "notifications"}
      </span>
      <p>{alert.message}</p>
      <button
        type="button"
        className="icon-button icon-button--small"
        onClick={onDismiss}
        aria-label="Dismiss alert"
        data-tooltip="Dismiss this notification."
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          close
        </span>
      </button>
    </div>
  );
}
