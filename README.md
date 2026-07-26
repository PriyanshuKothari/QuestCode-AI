# CodeQuest 🗡️

An AI-powered coding teaching game where programming challenges are delivered as fantasy story quests. Built with LangGraph, FastAPI, and React.

![CodeQuest UI](docs/screenshot.png)

---

## What it does

CodeQuest turns coding practice into a narrative RPG experience. Instead of dry "write a function that returns X" prompts, every challenge is embedded in a fantasy story — a wizard needs a spell calculated, a fairy needs to count her pebbles, a dragon hoards data that needs sorting.

An LLM judge evaluates submitted code not just for correct output, but for correct *approach* — catching hardcoded answers, wrong logic, and syntax errors with natural language feedback. Solve the quest, level up, get a harder story. Get it wrong, get targeted feedback and try again.

---

## Architecture

```
User Input (language + experience level)
          │
          ▼
  ┌───────────────┐
  │   Profiler    │  Agent 1 — extracts language and skill level (1–10)
  └───────┬───────┘
          │
          ▼
  ┌───────────────┐
  │  Story Maker  │  Agent 2 — generates story-wrapped coding challenge
  └───────┬───────┘
          │
          ▼
  [User writes code in Monaco Editor]
          │
          ▼
  ┌───────────────┐
  │  Smart Judge  │  Agent 3 — evaluates correctness, approach, and style
  └───────┬───────┘
          │
     ┌────┴────┐
     │         │
  Correct   Incorrect
     │         │
  Level Up  Feedback → retry
     │
  Story Maker generates next challenge
```

The three agents are orchestrated by **LangGraph**, with conditional routing — correct answers loop back to the Story Maker for a new challenge, wrong answers return feedback to the frontend without advancing the level.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Agent Orchestration | LangGraph |
| LLM | Groq API — `llama-3.3-70b-versatile` |
| Backend | FastAPI + Uvicorn |
| Frontend | React + Vite |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Session Storage | In-memory dict (dev) → Postgres (planned) |
| Tracing | LangSmith |
| Code Evaluation | LLM Judge (no sandboxed execution) |

---

## Key Design Decisions

**LLM-based code evaluation instead of sandboxed execution**

Most coding platforms run student code in a subprocess or external service (Judge0, Piston) and compare output. CodeQuest deliberately avoids this — the Smart Judge evaluates code by reading it, which means it catches hardcoded answers (`print(7)` instead of `print(3 + 4)`), identifies wrong approaches even when output is accidentally correct, and gives natural language feedback explaining *why* the code is wrong. This also eliminates the security complexity of running arbitrary user code server-side.

**LangGraph for agent orchestration**

The three-agent pipeline (profiler → story maker → judge) maps naturally to a state graph. LangGraph handles state merging between nodes, conditional routing after evaluation, and provides LangSmith tracing out of the box — every agent call is visible in the LangSmith dashboard with full input/output logging.

**Stateless HTTP with session-based state**

Each game session is stored server-side under a `session_id` (UUID4). The frontend only holds the `session_id` — all game state (level, score, current question, attempt count) lives on the backend. This makes the frontend simple and means session state survives page refreshes.

**Story narrative isolation from code hints**

An early prompt engineering challenge: the Story Maker LLM kept including variable names and operators in the question text, effectively handing students the solution. The final prompt explicitly forbids code-like syntax in question text — students must translate the narrative problem into code themselves, which is the actual learning objective.

---

## Project Structure

```
codequest/
├── agents/
│   ├── profiler.py          # Agent 1 — assess user level from natural language
│   ├── story_maker.py       # Agent 2 — generate story-wrapped coding challenge
│   └── smart_judge.py       # Agent 3 — evaluate code correctness and approach
│
├── graph/
│   ├── state.py             # GameState TypedDict
│   └── graph.py             # LangGraph wiring + compiled graphs
│
├── utils/
│   └── groq_client.py       # Shared Groq LLM client
│
├── api/
│   ├── main.py              # FastAPI app, CORS, router mounting
│   ├── models.py            # Pydantic request/response schemas
│   └── routes/
│       ├── game.py          # POST /start, /submit, /hint
│       └── session.py       # GET /state/{session_id}
│
├── services/
│   └── session_store.py     # In-memory session dict
│
└── frontend/
    └── src/
        ├── App.jsx           # Top-level state and API wiring
        ├── api.js            # Axios wrapper for backend calls
        └── components/
            ├── QuestPanel.jsx     # Story/question display + hint toggle
            ├── CodeEditor.jsx     # Monaco editor + submit button
            ├── FeedbackPanel.jsx  # Correct/incorrect feedback display
            └── StatsPanel.jsx     # Level and score display
```

---

## Running Locally

**Prerequisites:** Python 3.11+, Node 18+, Groq API key, LangSmith API key

**Backend**

```bash
# Clone and set up environment
git clone https://github.com/yourname/codequest.git
cd codequest

pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your GROQ_API_KEY and LANGSMITH_API_KEY

# Start the API server
uvicorn api.main:app --reload
# API available at http://localhost:8000
# Interactive docs at http://localhost:8000/docs
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
# UI available at http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/start` | Start a new game session |
| `POST` | `/api/submit` | Submit code for evaluation |
| `POST` | `/api/hint` | Get hint for current question |
| `GET` | `/api/session/{id}` | Get current session state |
| `GET` | `/` | Health check |

Full interactive docs available at `/docs` when running locally.

---

## Scoring

| Performance | Points |
|---|---|
| Correct on 1st attempt | +10 |
| Correct on 2nd attempt | +5 |
| Correct on 3rd+ attempt | +2 |

Attempt count resets on each new question. Score persists across the full session.

---

## Roadmap

- [ ] **Multi-tenant B2B system** — super admin, institution admins, student accounts
- [ ] **Training mode** — select topic (e.g. "Python loops") + question count, AI generates a focused set
- [ ] **Challenge mode** — admins publish timed challenges, live scoreboard, analytics dashboard
- [ ] **Goal mode** — student sets a learning goal, AI generates a checkpoint-based story arc
- [ ] **Persistent story universes** — select a narrative theme (sci-fi, crime thriller, fantasy) and all questions in a session are embedded in one coherent story
- [ ] **Postgres persistence** — replace in-memory sessions with a proper database
- [ ] **Multi-language support** — JavaScript, Java, C++ alongside Python

---

## What I learned building this

- **LangGraph state management** — understanding how TypedDict state merges across nodes, and when to use compiled graphs vs direct node calls
- **Prompt engineering for structured output** — getting LLMs to reliably return parseable formats while also constraining what they say in the content itself (the "don't leak the answer" problem)
- **LLM-as-judge pattern** — evaluating code semantically rather than by output matching, including detecting hardcoded answers and wrong approaches
- **FastAPI session architecture** — designing stateless HTTP endpoints around server-side session state
- **React + Monaco integration** — wiring a real code editor to a game loop with immediate LLM feedback

---

## Environment Variables

```env
GROQ_API_KEY=your_groq_key_here
LANGSMITH_API_KEY=your_langsmith_key_here
LANGCHAIN_TRACING_V2=true
```

---

*Built as a learning project exploring agentic AI systems and LLM-powered education tools.*
