import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, onChange, onSubmit, language, submitting }) {
  return (
    <div className="editor-panel">
      <div className="editor-header">
        <span className="editor-filename">solution.{language === "python" ? "py" : "js"}</span>
      </div>

      <Editor
        height="320px"
        language={language || "python"}
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value ?? "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 12 },
        }}
      />

      <button className="submit-btn" onClick={onSubmit} disabled={submitting || !code.trim()}>
        {submitting ? "Judging…" : "Submit Solution"}
      </button>

      <style>{`
        .editor-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .editor-header {
          padding: 0.65rem 1rem;
          border-bottom: 1px solid var(--border);
          background: var(--surface-raised);
        }
        .editor-filename {
          font-size: 0.8rem;
          color: var(--text-dim);
          font-family: monospace;
        }
        .submit-btn {
          margin: 1rem;
          padding: 0.75rem;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: background 0.15s;
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--accent-dim);
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
