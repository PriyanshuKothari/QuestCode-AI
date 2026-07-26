import { useState, useEffect } from "react";
import StatsPanel from "./components/StatsPanel";
import QuestPanel from "./components/QuestPanel";
import CodeEditor from "./components/CodeEditor";
import FeedbackPanel from "./components/FeedbackPanel";
import { startGame, submitCode } from "./api";

export default function App() {
  // Core game state — mirrors the backend's GameState shape
  const [sessionId, setSessionId] = useState(null);
  const [language, setLanguage] = useState("python");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState("");
  const [hint, setHint] = useState("");

  // UI-only state
  const [code, setCode] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // null = no submission yet
  const [mistake, setMistake] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [error, setError] = useState(null);

  // Kick off a new session on first load.
  // Hardcoded user_input for now — swap for an onboarding form later if you want
  // to let the player describe their own language/level instead.
  useEffect(() => {
    async function init() {
      try {
        const data = await startGame("I want to learn Python, I'm a beginner");
        setSessionId(data.session_id);
        setLanguage(data.language);
        setLevel(data.level);
        setQuestion(data.question);
        setHint(data.hint || "");
        setScore(data.score);
      } catch (err) {
        setError("Could not reach the game server. Is the backend running on port 8000?");
      } finally {
        setLoadingQuestion(false);
      }
    }
    init();
  }, []);

  async function handleSubmit() {
    if (!sessionId || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const data = await submitCode(sessionId, code);
      setIsCorrect(data.is_correct);
      setFeedback(data.feedback);
      setMistake(data.mistake);
      setScore(data.score);

      if (data.is_correct) {
        setLevel(data.level);
        setQuestion(data.question);
        setHint(data.hint || "");
        setScore(data.score);
        setCode(""); // clear editor for the new question
      }
    } catch (err) {
      setError("Submission failed — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-shell">
      <StatsPanel level={level} score={score} />

      <main className="layout">
        <section className="left-col">
          <QuestPanel question={question} hint={hint} loading={loadingQuestion} />
        </section>

        <section className="right-col">
          <CodeEditor
            code={code}
            onChange={setCode}
            onSubmit={handleSubmit}
            language={language}
            submitting={submitting}
          />
          <FeedbackPanel isCorrect={isCorrect} feedback={feedback} mistake={mistake} />
          {error && <div className="error-banner">{error}</div>}
        </section>
      </main>

      <style>{`
        .app-shell {
          min-height: 100vh;
        }
        .layout {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 1.5rem;
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .left-col, .right-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .error-banner {
          background: var(--warn-bg);
          border: 1px solid var(--warn);
          color: var(--warn);
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
        }
        @media (max-width: 800px) {
          .layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
