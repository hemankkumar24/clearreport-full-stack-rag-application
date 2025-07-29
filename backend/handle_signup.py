import os
from supabase import create_client, Client
from dotenv import load_dotenv  
from fastapi import Response, Request, Cookie, HTTPException,Response                     
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def handle_signup(data, response):
    try:
        auth_response = supabase.auth.sign_up({ "email": data.email,
                                           "password": data.password})
        
        if auth_response.user and auth_response.session:
            access_token = auth_response.session.access_token
            
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True, 
                samesite='lax' 
            )
            
            user_id = auth_response.user.id
            
            data = supabase.table("profiles").insert({
                            "id":user_id
            }).execute()
            print(data)
            return {"message": "Signup successful and session cookie set."}
        else:
            raise HTTPException(status_code=400, detail="Signup failed. User may already exist or invalid credentials.")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    
