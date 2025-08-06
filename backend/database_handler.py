import os
from supabase import create_client, Client
from dotenv import load_dotenv  

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  

def data_feed(data_recieved, user_id, report_name, access_token):
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    supabase.auth.set_session(access_token=access_token, refresh_token="")
    
    data = supabase.table("reports").insert({"user_id": user_id, "report_name": report_name, "extracted_text": data_recieved, "parsed_successfully": True}).execute()
    
    for test in data_recieved["tests"]:
        data = supabase.table("test_results").insert({"report_id": user_id, "test_name": str(test['name']), "test_value": int(test['result']), "unit": str(test['unit']).split(" ")[0],
        "reference_range": str(test['normal_range']), "test_status": str(test['status']), "report_name": report_name}).execute() 