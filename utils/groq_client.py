from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

def get_groq_client():
    chat_groq = ChatGroq(
        model="llama-3.3-70b-versatile",
    )
    return chat_groq