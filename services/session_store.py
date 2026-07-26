from uuid import uuid4
from graph.state import GameState

sessions: dict[str, GameState] = {}

def create_session(state: GameState) -> str:
    session_id = str(uuid4())
    sessions[session_id] = state
    return session_id

def get_session(session_id: str) -> GameState | None:
    return sessions.get(session_id)

def update_session(session_id: str, state: GameState) -> None:
    sessions[session_id] = state
    
