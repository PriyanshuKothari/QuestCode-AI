from utils.groq_client import get_groq_client
from graph.state import GameState

def profiler_node(state: GameState) -> GameState:
    llm = get_groq_client()
    
    prompt = f"""
    You are a game profiler for a coding learning game.
    The user said: "{state['user_input']}"
    
    From this extract:
    1. What programming language they want to learn
    2. Their experience level as a number from 1 to 10
       (1 = complete beginner, 10 = expert)
    
    Reply in this exact format only:
    language: python
    level: 2
    """
    
    response = llm.invoke(prompt)
    
    parsed={}
    for line in response.content.strip().split("\n"):
        if ':' in line:
            key, value = line.split(':', 1)
            parsed[key.strip()] = value.strip()
    
    
    return {'language': parsed['language'], 'level': int(parsed['level'])}