import os
import requests
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from fastapi.responses import JSONResponse
from dotenv import load_dotenv  
from tesseract import return_text
from typing import Annotated
from delete_pinecone import delete_pinecone
from askai import call_ai
import json 

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

class AIRequest(BaseModel):
    user_id: str
    latest_data: str
    question: str

@app.post("/handlepdf")
async def handlepdf(user_id: Annotated[str, Form()],access_token: Annotated[str, Form()],   file: UploadFile = File(...)):
    response = return_text(file, user_id, access_token)
    return response
    
@app.post("/deletepinecone")
async def deletepinecone(user_id, file_name):
    response = delete_pinecone(user_id, file_name)
    
@app.post("/ask_ai")
async def ask_ai(payload: AIRequest):
    try:
        latest_docs = json.loads(payload.latest_data)
    except Exception:
        latest_docs = []
    print(payload.user_id, latest_docs, payload.question)
    response = call_ai(payload.user_id, latest_docs, payload.question)
    return JSONResponse(content={"answer": response})