import os
from pinecone import Pinecone
from dotenv import load_dotenv  
load_dotenv()
PINECONE_KEY = os.getenv("PINECONE_API_KEY")
index_name = "healthcare-reports"
pc = Pinecone(api_key=PINECONE_KEY)
index = pc.Index(index_name)

def delete_pinecone(user_id, file_name):
    id = file_name + user_id 
    index.delete(ids=[id])

