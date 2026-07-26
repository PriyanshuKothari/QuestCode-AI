import json
from utils.groq_client import get_groq_client
from graph.state import GameState

def smart_judge_node(state: GameState) -> GameState:
    llm = get_groq_client()

    prompt = f"""
    You are an expert coding teacher and judge for a beginner coding game.
    
    Question given to student: "{state['question']}"
    Hint provided: "{state['hint']}"
    Expected output: "{state['expected_output']}"
    Student's code:
    {state['user_code']}
    
    Evaluate the student's code:
    1. Does it correctly solve the problem?
    2. Does it use the right approach (not hardcoded output)?
    3. Are there any syntax errors?
    
    Reply ONLY with a JSON object, no extra text, no markdown:
    {{"is_correct": "yes", "feedback": "your feedback here", "mistake": "none or describe mistake"}}
    """

    response = llm.invoke(prompt)
    
    # clean markdown backticks if LLM adds them
    raw = response.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    
    parsed = json.loads(raw)
    
    return {
        "is_correct": parsed["is_correct"].strip().lower() == "yes",
        "feedback": parsed["feedback"],
        "mistake": parsed["mistake"]
    }