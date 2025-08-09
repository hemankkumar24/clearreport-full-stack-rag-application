import os
from supabase import create_client, Client
from dotenv import load_dotenv  
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
load_dotenv()

PINECONE_KEY = os.getenv("PINECONE_API_KEY")
index_name = "healthcare-reports"
pc = Pinecone(api_key=PINECONE_KEY)
index = pc.Index(index_name)


model = SentenceTransformer('all-MiniLM-L6-v2')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  

def data_feed(data_recieved, user_id, report_name, access_token):
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    supabase.auth.set_session(access_token=access_token, refresh_token="")
    
    data = supabase.table("reports").insert({"user_id": user_id, "report_name": report_name, "extracted_text": data_recieved, "parsed_successfully": True}).execute()
    
    for test in data_recieved["tests"]:
        data = supabase.table("test_results").insert({"report_id": user_id, "test_name": str(test['name']), "test_value": int(test['result']), "unit": str(test['unit']).split(" ")[0],
        "reference_range": str(test['normal_range']), "test_status": str(test['status']), "report_name": report_name}).execute() 
    
    text_to_embed = f"Report Name: {report_name}. " + \
                " ".join([f"{t['name']} {t['result']} {t['unit']} (Normal: {t['normal_range']})" 
                          for t in data_recieved["tests"]])

    extracted_text_embedding = model.encode(text_to_embed).tolist()
    
    print(text_to_embed)
    metadata = {    
                "user_id": user_id,
                "original_text": text_to_embed
            }
    
    index.upsert(vectors=[{
        "id": (report_name + user_id),
        "values": extracted_text_embedding,
        "metadata": metadata
    }])
        
    