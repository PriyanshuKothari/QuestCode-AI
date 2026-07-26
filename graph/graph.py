from langgraph.graph import StateGraph, START, END
from graph.state import GameState
from agents.profiler import profiler_node
from agents.story_maker import story_maker_node
from agents.smart_judge import smart_judge_node



graph = StateGraph(GameState)

graph.add_node("profiler", profiler_node)
graph.add_node("story_maker", story_maker_node)
graph.add_node("code_judge", smart_judge_node)

graph.add_edge(START, "profiler")
graph.add_edge("profiler", "story_maker")
graph.add_edge("story_maker", "code_judge")

def route_after_judge(state: GameState) -> str:
    if state["is_correct"]:
        return "story_maker"
    else:
        return END
    
graph.add_conditional_edges("code_judge", route_after_judge)


app = graph.compile()

start_graph = StateGraph(GameState)
start_graph.add_node("profiler", profiler_node)
start_graph.add_node("story_maker", story_maker_node)
start_graph.add_edge(START, "profiler")
start_graph.add_edge("profiler", "story_maker")
start_graph.add_edge("story_maker", END)

start_app = start_graph.compile()