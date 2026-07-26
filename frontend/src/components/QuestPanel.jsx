import { useState } from "react";

export default function QuestPanel({ question, hint, loading }) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="quest-panel">
      <div className="quest-eyebrow">Current Quest</div>

      {loading ? (
        <p className="quest-text loading">Summoning your next challenge…</p>
      ) : (
        <p className="quest-text">{question}</p>
      )}

      <button
        className="hint-toggle"
        onClick={() => setShowHint((v) => !v)}
        disabled={!hint}
      >
        {showHint ? "Hide hint" : "Reveal hint"}
      </button>

      {showHint && hint && <p className="hint-text">{hint}</p>}

      <style>{`
        .quest-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-left: 3px solid var(--accent);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .quest-eyebrow {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent);
          font-weight: 600;
        }
        .quest-text {
          font-family: var(--font-display);
          font-size: 1.05rem;
          line-height: 1.65;
          color: var(--text);
          margin: 0;
        }
        .quest-text.loading {
          color: var(--text-dim);
          font-style: italic;
        }
        .hint-toggle {
          align-self: flex-start;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-dim);
          padding: 0.5rem 0.9rem;
          border-radius: 6px;
          font-size: 0.85rem;
          transition: border-color 0.15s, color 0.15s;
        }
        .hint-toggle:hover:not(:disabled) {
          border-color: var(--accent);
          color: var(--accent);
        }
        .hint-toggle:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .hint-text {
          background: var(--surface-raised);
          border-radius: 6px;
          padding: 0.85rem 1rem;
          font-size: 0.9rem;
          color: var(--text-dim);
          margin: 0;
        }
      `}</style>
    </div>
  );
}
