from typing import TypedDict

class GameState(TypedDict):
    language: str              # e.g. "python"
    level: int                 # 1–10
    user_code: str             # the code the user has written so far for the current question
    question: str              # current story question
    hint: str                  # a hint to help the user
    expected_output: str       # the expected output for the current question
    feedback: str              # feedback about the user's code
    is_correct: bool           # whether the user's code is correct
    mistake: str               # a description of the user's mistake, if any
    history: list[dict]        # a list of previous actions taken by the user
    score: int                 # tracks XP / total score across levels
    attempts: int              # how many tries on the current question
    user_input: str            # raw text from the user