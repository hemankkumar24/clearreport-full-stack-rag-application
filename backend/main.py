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

@app.post("/handlepdf")
async def handlepdf(user_id: Annotated[str, Form()],access_token: Annotated[str, Form()],   file: UploadFile = File(...)):
    response = return_text(file, user_id, access_token)
    return response
    
    

