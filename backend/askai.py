import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv  
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from langchain_core.prompts import ChatPromptTemplate  
from langchain_google_genai import ChatGoogleGenerativeAI
load_dotenv()

PINECONE_KEY = os.getenv("PINECONE_API_KEY")
index_name = "healthcare-reports"

pc = Pinecone(api_key=PINECONE_KEY)

index = pc.Index(index_name) 

model = SentenceTransformer('all-MiniLM-L6-v2')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",   # or "gemini-1.5-pro" for higher quality
    temperature=0,
    google_api_key=os.getenv("GEMINI_API_KEY")
)

def call_ai(user_id, latest_data, question):
    messages = [
    ("system", """
        You are a smart, conversational healthcare assistant. Your goal is to be genuinely helpful.

        You will be given the user's question and context from their health documents. Your most important task is to first determine if the provided documents are actually relevant to the user's question before answering. Do not use the documents if they are not relevant.
    """),
    ("human", """
        Follow these rules strictly:

        1. Analyze the user's question: Is it a casual greeting or conversational (for example, "hello", "thanks", or "how are you?")? Or is it a specific question related to their health data?

        2. Handle greetings and casual conversation: If the question is conversational, ignore the documents completely and respond politely and naturally like a friendly assistant.

        3. Handle health-related questions:
           - If the documents are relevant to the question, use them to provide a clear and factual answer.
           - If the documents are not relevant, inform the user that no information was found regarding their question. For example, say: "I've checked your latest reports, but I couldn't find any information about [topic]."
           - Never summarize documents that do not relate to the user's question.

        ---
        CONTEXT:
        Latest documents:
        {latest_docs}

        Similar document:
        {similar_doc}
        ---

        User's Question: "{question}"

        ---
        Instructions for your final answer:
        - Do not explain your process; just provide the answer.
        - Begin with a direct summary.
        - Use bullet points to list key findings from each report.
        - Clearly highlight any results that are High, Low, or outside the normal range.

        Answer:
    """)
]

    
    prompt_template = ChatPromptTemplate.from_messages(messages)
    chain = prompt_template | llm
    user_question = question
    query_vector = model.encode(user_question)
    query_vector_list = query_vector.tolist()
    
    result = index.query(
    vector=query_vector_list,
    top_k=1,
    include_metadata=True,
    filter={"user_id": user_id})   
    
    if result['matches']:
      original_text = result['matches'][0]['metadata']['original_text']
    else:
      original_text = "No reports uploaded yet"
    
    if latest_data:
        latest_doc_texts = [json.dumps(doc['extracted_text'], indent=2) for doc in latest_data[:3]]
        latest_docs_context = "\n\n---\n\n".join(latest_doc_texts)
    else:
        latest_docs_context = "No latest documents available."
    
    response = chain.invoke({
        "question": user_question,
        "latest_docs": latest_docs_context,
        "similar_doc": original_text
    })
    
    return response.content
    
        
