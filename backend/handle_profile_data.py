import os
from supabase import create_client, Client
from dotenv import load_dotenv  
from fastapi import Response, Request, Cookie, HTTPException,Response                     
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def handle_profile_data(request):
    token = request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(
            status_code=401, 
            detail="Not authenticated: No session token found."
        )
    
    try:
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        return {"id": user.id, "email": user.email, "created_at": user.created_at}
    except Exception as e:
        raise HTTPException(
            status_code=401, 
            detail=f"Invalid token: {e}"
        )