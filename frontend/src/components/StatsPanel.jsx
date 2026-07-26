export default function StatsPanel({ level, score }) {
  return (
    <header className="topbar">
      <h1 className="logo">CodeQuest</h1>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Level</span>
          <span className="stat-value">{level ?? "—"}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-label">Score</span>
          <span className="stat-value">{score ?? 0}</span>
        </div>
      </div>

      <style>{`
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
        }
        .logo {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 600;
          margin: 0;
          letter-spacing: 0.02em;
        }
        .stats {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .stat {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-faint);
        }
        .stat-value {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--accent);
        }
        .stat-divider {
          width: 1px;
          height: 28px;
          background: var(--border);
        }
      `}</style>
    </header>
  );
}
