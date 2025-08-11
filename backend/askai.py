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
                    You are a smart, analytical health and wellness assistant. Your primary responsibility is **accuracy and safety**.
                    
                    Your goal is to provide a concise, scannable summary of a user's health report. It is better to state that data is unclear than to misinterpret it. You are NOT a medical doctor and MUST include a disclaimer.
                """),
                ("human", """
                    Follow these rules strictly:

                    1.  **Safety First - Sanity-Check All Data:** Before generating a response, critically evaluate the extracted data.
                        * If a value seems physiologically impossible (e.g., HbA1c > 20%, MCHC > 40 g/dL), you MUST state that the value is 'unclear or likely a data error'. Do not present it as a fact.
                        * If a unit of measurement is nonsensical or unrecognized (e.g., 'jul', 'takhyl'), you MUST state that the unit is 'unrecognized' and the data is unclear. Do not guess.

                    2.  **Be Brief and To The Point:** Keep the final response concise.

                    3.  **Handle Ambiguity:** If an abbreviation is unclear (e.g., "Mcy"), note it as unclear instead of guessing.

                    4.  **Handle Casual Conversation:** If the user's query is conversational, ignore the documents and respond politely.

                    ---
                    CONTEXT:
                    Latest documents:
                    {latest_docs}

                    Similar document:
                    {similar_doc}
                    ---

                    User's Question: "{question}"

                    ---
                    **Instructions for your Final Answer Format**:

                    * Your entire response should be very brief.
                    * Use the following clear, scannable sections:

                    **Key Findings:**
                    * Provide a 1-sentence summary.
                    * List only the most noteworthy results. When data is suspect, describe the issue clearly.
                    * *Example of a good entry:* "- **HbA1c:** 5.8% (Slightly elevated)"
                    * *Example of handling bad data:* "- **Platelet Count:** 2.4 takhyl (Value unclear due to unrecognized unit)"
                    * *Example of handling impossible data:* "- **HbA1c:** 63% (Value appears physiologically impossible and is likely a data error. Please verify with the original report.)"

                    **Actionable Takeaways:**
                    * Provide 1-2 direct, actionable suggestions based on the *valid* findings.
                    * List 1-2 brief meal ideas that support the suggestions.

                    **Disclaimer:**
                    * You MUST end with this exact text: "**Disclaimer:** I am an AI assistant, not a doctor. Please consult a healthcare professional for medical advice."

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
    
        
