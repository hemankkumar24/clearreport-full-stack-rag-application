import os
import requests
from fastapi import FastAPI, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from handle_signup import handle_signup
from handle_login import handle_login
from fastapi.responses import JSONResponse
from check_signedin import checksignedin
from dotenv import load_dotenv  

load_dotenv()
app = FastAPI()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SignupData(BaseModel):
    email: str
    password: str
    
class TokenPayload(BaseModel):
    access_token: str
    refresh_token: str

@app.post("/signup")
async def signup(data: SignupData):
    response_returned = handle_signup(data)
    return response_returned
 
@app.post("/login")
async def login(data: SignupData, response: Response):
    print(data)
    auth_response = handle_login(data)
    
    if auth_response and auth_response.session:
        
        access_token = auth_response.session.access_token
        refresh_token = auth_response.session.refresh_token

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,  # False for now
            samesite="lax"
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,  # False for now
            samesite="lax"
        )
        print("Login successful, cookies set.")
        return {"message": "Login successful"}
    else:
        raise HTTPException(
            status_code=401,
            detail="Invalid login credentials."
        )


@app.get("/checkloggedin")
async def check_logged_in(request: Request): # Removed response from signature, will create it as needed
    """
    Checks login status and refreshes the session if necessary.
    """
    access_token = request.cookies.get("access_token")

    if access_token:
        try:
            user_response = supabase.auth.get_user(access_token)
            if user_response.user:
                return {"status": "logged_in", "user": user_response.user.model_dump()}
        except Exception:
            print("Access token invalid, attempting refresh.")
            pass # Proceed to refresh logic

    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Not logged in: No refresh token.")

    try:
        session_response = supabase.auth.refresh_session(refresh_token)
        session = session_response
        
        if not session.user:
             raise Exception("Could not refresh session.")

        print("Session successfully refreshed.")
        
        # --- THIS IS THE FIX ---
        # Create a JSONResponse object to hold the body content
        response = JSONResponse(content={"status": "refreshed", "user": session.user.model_dump()})
        
        # Now, set the cookies on this new response object
        response.set_cookie(key="access_token", value=session.access_token, httponly=True, secure=False, samesite="lax")
        response.set_cookie(key="refresh_token", value=session.refresh_token, httponly=True, secure=False, samesite="lax")
        
        return response

    except Exception as e:
        print(f"Refresh token failed: {e}")
        # Create a JSONResponse for the error as well
        response = JSONResponse(
            status_code=401, 
            content={"detail": "Session expired. Please log in again."}
        )
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response
