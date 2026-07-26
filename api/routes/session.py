from fastapi import APIRouter, HTTPException

from api.models import SessionState
from services.session_store import get_session

router = APIRouter()

@router.get("/session/{session_id}", response_model=SessionState)
def get_session_state(session_id: str):
    state = get_session(session_id)
    
    if state is None:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return SessionState(
        session_id=session_id,
        language=state["language"],
        level=state["level"],
        question=state["question"],
        hint=state["hint"],
        score=state["score"],
        attempts=state["attempts"],
        is_correct=state["is_correct"],
        feedback=state["feedback"],
    )