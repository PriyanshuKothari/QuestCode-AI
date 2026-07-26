from pydantic import BaseModel
from typing import Optional


# --- /start ---

class StartRequest(BaseModel):
    user_input: str  # e.g. "I want to learn Python, I'm a beginner"


class StartResponse(BaseModel):
    session_id: str
    language: str 
    question: str
    hint: Optional[str] = None
    level: int
    score: int


# --- /submit ---

class SubmitRequest(BaseModel):
    session_id: str
    code: str  # the user's submitted solution


class SubmitResponse(BaseModel):
    is_correct: bool
    feedback: str
    mistake: Optional[str] = None
    question: Optional[str] = None  # present if leveled up
    hint: Optional[str] = None      # optional new hint
    level: Optional[int] = None     # updated level if progressed
    score: Optional[int] 


# --- optional small model for /hint ---

class HintRequest(BaseModel):
    session_id: str
    
class HintResponse(BaseModel):
    hint: str
    
class SessionState(BaseModel):
    session_id: str
    language: str
    level: int
    question: str
    hint: str
    score: int
    attempts: int
    is_correct: bool
    feedback: str