from utils.groq_client import get_groq_client
from graph.state import GameState

def story_maker_node(state: GameState) -> GameState:
    llm = get_groq_client()
    
    prompt = f"""
    You are a story maker for a coding learning game.
    Language: {state['language']}, Level: {state['level']}
    
    Create a coding challenge wrapped in a short fantasy story.
    
    STRICT RULES:
    1. The problem must have ONE clear correct answer
    2. expected_output must be a simple number or string only
    3. Solution must be achievable in 3-5 lines of basic Python
    4. Level 1-3: only use print, variables, basic math (+, -, *, /)
    5. Level 4-6: can use loops, conditionals
    6. Level 7-10: can use functions, lists
    7. Verify in your head that expected_output is mathematically correct
    8. expected_output should be what print() outputs, not the expression
    9. Remove brackets from your reply
    10. Describe the problem ONLY in narrative/story terms. NEVER include variable names, operators (+, -, *, /), or any code-like syntax in the question text. The student must translate the story into code themselves — do not write the code or formula for them.
    
    Reply in this exact format only:
    question: [story + coding task]
    hint: [helpful hint without giving away the answer]
    expected_output: [exact output the correct code should print]
    """
    
    response = llm.invoke(prompt)
    
    parsed = {}
    for line in response.content.strip().split("\n"):
        if ":" in line:
            key, value = line.split(":", 1)
            parsed[key.strip()] = value.strip().strip("[]")
    
    return {
        "question": parsed["question"],
        "hint": parsed["hint"],
        "expected_output": parsed["expected_output"]
    }