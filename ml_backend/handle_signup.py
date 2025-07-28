import os
from supabase import create_client, Client
from dotenv import load_dotenv                        

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

response = supabase.auth.sign_up({ "email": input("users_email"), "password": input("users_password") })

user_id = response.user.id

data = supabase.table("profiles").insert({"id": user_id, 
                                          "full_name":"Hemank Kumar",
                                          "age":24             ,
                                          "gender": "Male"     }).execute()

print(data)