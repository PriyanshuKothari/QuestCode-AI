import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export async function startGame(userInput) {
  const res = await client.post("/start", { user_input: userInput });
  return res.data;
}

export async function submitCode(sessionId, code) {
  const res = await client.post("/submit", {
    session_id: sessionId,
    code,
  });
  return res.data;
}

export async function getHint(sessionId) {
  const res = await client.post("/hint", { session_id: sessionId });
  return res.data;
}

export async function getSessionState(sessionId) {
  const res = await client.get(`/session/${sessionId}`);
  return res.data;
}
