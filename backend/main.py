import os
from fastapi import FastAPI, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from handle_signup import handle_signup
from handle_login import handle_login
from handle_profile_data import handle_profile_data

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
async def login(data: SignupData,  response: Response):
    print(data)
    response_returned = handle_login(data, response)
    return response_returned

@app.get("/getprofiledata")
async def getprofdata(request: Request):
    response_returned = handle_profile_data(request)
    return response_returned