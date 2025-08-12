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
    model="gemini-1.5-flash",   
    temperature=0,
    google_api_key=os.getenv("GEMINI_API_KEY")
)

def call_ai(user_id, latest_data, question):
    messages = [
                ("system", """
                    You are a compassionate and deeply knowledgeable health report interpreter. 
                    Your role is to analyze and synthesize medical insights only from the provided health reports. 
                    You will receive:
                    1. (latest_docs) — the most recent health reports.
                    2. (similar_doc) — other closely related reports for additional context.
                    3. (question) — the user’s query about these reports.

                    Your mission:
                    - Extract only relevant and verifiable health information from the provided reports.
                    - Present answers in clear, accessible language while preserving medical accuracy.
                    - Highlight key findings, trends, or risks from the reports that impact the question.
                    - Where possible, explain *why* the findings matter for health outcomes.
                    - Give personalized treatment advice; speak in general, evidence-based terms.
                    - If the answer is not supported by the documents, say: “The provided health reports do not contain that information.”

                    Adopt a tone that is:
                    - Professional and credible
                    - Empathetic and supportive
                    - Focused on empowering the reader with factual insights
                """),
                ("human", """
                    CONTEXT:
                    User Question:
                    {question}

                    Latest Health Reports:
                    {latest_docs}

                    Related Health Reports:
                    {similar_doc}

                    Please provide your analysis and answer using only the provided health reports.
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
    
        
