import os
from fastapi import FastAPI, Request, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from handle_signup import handle_signup
from handle_login import handle_login

app = FastAPI()

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

@app.post("/signup")
async def signup(data: SignupData, response: Response):
    print(data)
    response_returned = handle_signup(data, response)
    return response_returned
 
@app.post("/login")
async def login(data: SignupData,  request: Request):
    print(data)
    response_returned = handle_login(data, request)
    return response_returned