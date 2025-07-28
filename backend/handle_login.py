import os
from supabase import create_client, Client
from fastapi import HTTPException, Response
from dotenv import load_dotenv                        
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def handle_login(data, request):
    token = request.cookies.get("access_token")
    if not token:
        return("no token")
        try:
            auth_response = supabase.auth.sign_in_with_password({ "email": data.email,
                                            "password": data.password})
            
            if auth_response.user is None:
                print("Sign in failed, user is None. Error:", auth_response)
                return {"error": "Sign in failed"}
            else:
                return {"success": "Signed in successfully!"}
        except Exception as e: 
            print("reached exception!")
            raise HTTPException(status_code=500, detail="Internal server error. Please try again.")
        
    try:
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        return {"id": user.id, "email": user.email, "created_at": user.created_at}
    except:
        raise HTTPException(status_code=401, detail="Invalid token. Please log in again.")
