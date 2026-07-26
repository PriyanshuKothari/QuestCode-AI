from fastapi import APIRouter, HTTPException
from api.models import StartRequest, StartResponse, SubmitRequest, SubmitResponse, HintRequest, HintResponse
from agents.smart_judge import smart_judge_node
from agents.story_maker import story_maker_node
from graph.graph import start_app
from services.session_store import get_session,update_session,create_session

router = APIRouter()

@router.post("/start", response_model=StartResponse)
def start_game(request: StartRequest):
    initial_state = {
        "user_input": request.user_input,
        "language": "",
        "level": 1,
        "user_code": "",
        "question": "",
        "hint": "",
        "expected_output": "",
        "feedback": "",
        "mistake": "",
        "is_correct": False,
        "score": 0,
        "attempts": 0,
        "history": [],
    }
    result_state = start_app.invoke(initial_state)

    session_id = create_session(result_state)

    return StartResponse(
        session_id=session_id,
        language=result_state["language"],
        question=result_state["question"],
        hint=result_state["hint"],
        level=result_state["level"],
        score=result_state["score"],
    )
    
@router.post("/submit", response_model=SubmitResponse)
def submit_answer(request: SubmitRequest):
    state = get_session(request.session_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Session not found")

    state["user_code"] = request.code
    state["attempts"] += 1

    result_state = smart_judge_node(state)
    state.update(result_state)

    if state["is_correct"]:

        # Score system
        if state["attempts"] == 1:
            state["score"] += 10
        elif state["attempts"] == 2:
            state["score"] += 5
        else:
            state["score"] += 2

        state["level"] += 1

        new_question_state = story_maker_node(state)
        state.update(new_question_state)

        state["feedback"] = ""
        state["mistake"] = ""
        state["attempts"] = 0

    update_session(request.session_id, state)

    return SubmitResponse(
        is_correct=state["is_correct"],
        feedback=state["feedback"],
        mistake=state["mistake"],
        question=state["question"] if state["is_correct"] else None,
        hint=state["hint"] if state["is_correct"] else None,
        level=state["level"] if state["is_correct"] else None,
        score=state["score"],
    )
    
@router.post("/hint",response_model=HintResponse)
def get_hint(request: HintRequest):
    state = get_session(request.session_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Session not found")

    if state["hint"]:
        return HintResponse(hint=state["hint"])
    else:
        return HintResponse(hint="No hint available for this question.")