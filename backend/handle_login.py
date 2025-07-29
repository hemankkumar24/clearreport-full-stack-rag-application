import os
from supabase import create_client, Client
from fastapi import HTTPException, Response
from dotenv import load_dotenv                        
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def handle_login(data, response):
    try:
        auth_response = supabase.auth.sign_in_with_password({ "email": data.email,
                                        "password": data.password})
        
        if auth_response.user and auth_response.session:
            access_token = auth_response.session.access_token
            
            response.set_cookie(
                key='access_token',
                value= access_token,
                httponly= True,
                samesite = 'lax'
            )
            
            return {"message": "Login successful!"}
        
    except Exception as e: 
        print("reached exception!")
        raise HTTPException(status_code=500, detail="Internal server error. Please try again.")
        
    