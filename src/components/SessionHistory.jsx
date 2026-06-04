import { getModeLabel } from "../hooks/useTimer.js";

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function SessionHistory({ history, tasks }) {
  const taskMap = new Map(tasks.map((task) => [task.id, task.title]));
  const recentHistory = history.slice(0, 6);

  return (
    <section className="history-card">
      <div className="section-heading">
        <div>
          <p className="label-caps">Recent Successes</p>
          <h3>Session History</h3>
        </div>
      </div>
      {recentHistory.length === 0 ? (
        <p className="empty-state">Completed intervals will appear here.</p>
      ) : (
        <div className="history-list">
          {recentHistory.map((session) => (
            <article key={session.id} className="history-item">
              <span className="material-symbols-outlined" aria-hidden="true">
                {session.type === "focus" ? "timer" : "spa"}
              </span>
              <div>
                <strong>{getModeLabel(session.type)}</strong>
                <p>{taskMap.get(session.taskId) || `${session.durationMinutes} minute interval`}</p>
              </div>
              <time dateTime={session.completedAt}>{formatDate(session.completedAt)}</time>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
