export default function FeedbackPanel({ isCorrect, feedback, mistake }) {
  if (feedback == null) return null;

  return (
    <div className={`feedback-panel ${isCorrect ? "correct" : "incorrect"}`}>
      <div className="feedback-status">
        {isCorrect ? "✓ Quest complete" : "↻ Not quite — try again"}
      </div>
      <p className="feedback-text">{feedback}</p>
      {!isCorrect && mistake && mistake.toLowerCase() !== "none" && (
        <p className="mistake-text">
          <strong>What went wrong:</strong> {mistake}
        </p>
      )}

      <style>{`
        .feedback-panel {
          border-radius: 8px;
          padding: 1rem 1.25rem;
          border: 1px solid;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .feedback-panel.correct {
          background: var(--success-bg);
          border-color: var(--success);
        }
        .feedback-panel.incorrect {
          background: var(--warn-bg);
          border-color: var(--warn);
        }
        .feedback-status {
          font-weight: 600;
          font-size: 0.9rem;
        }
        .correct .feedback-status { color: var(--success); }
        .incorrect .feedback-status { color: var(--warn); }
        .feedback-text {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text);
          line-height: 1.5;
        }
        .mistake-text {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-dim);
        }
      `}</style>
    </div>
  );
}
