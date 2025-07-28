import os
import shutil                                          # to delete file
from dotenv import load_dotenv                         # load .env
from sentence_transformers import SentenceTransformer  # for vector embeddings
from langchain_core.prompts import ChatPromptTemplate  # prompt template
from langchain_community.chat_models import ChatOllama # ollama model 
from ocr_tesseract import return_text
# ---------------------------------------------------- #

model = SentenceTransformer('all-MiniLM-L6-v2')        # sentence transformer model

llm = ChatOllama(
    model="llama3.2", 
    temperature=0  
)

messages = [          # our prompt template
    ("system", """
    You are a highly intelligent and precise medical report parser. Your task is to extract a clean, structured JSON object from potentially noisy OCR text.

    Your response MUST be a single, valid JSON object and nothing else. Do not include any markdown, commentary, or text before or after the JSON block.

    **Output Format:**
    {{
    "patient": {{...}},
    "tests": [
    {{
    "name": "Hemoglobin",
    "result": 14.8,
    "unit": "g/dL",
    "normal_range": [13.5, 17.5],
    "status": "Normal"
    }},
    {{
    "name": "Blood Urea",
    "result": 22,
    "unit": "mg/dL (Predicted)",
    "normal_range": [10, 40],
    "status": "Normal (Assumed)"
    }},
    ...
    ],
    ...
    "remarks": [
        "Lipid profile within acceptable limits.",
        "No abnormal findings in radiological scans."
    ],
    "doctor": {{
        "name": "Dr. Neha Kapoor"
    }},
    }}

    **Extraction and Logic Guidelines:**

    1.  **JSON Structure:** Adhere strictly to the format above. If the input text is empty or completely unintelligible, return an empty JSON object: `{{}}`.
    2.  **Date Standardization:** Convert all dates to `YYYY-MM-DD` format.
    3.  **Unit Inference:** If a unit is missing from the source text, you MUST infer the most likely standard unit. The resulting string in the JSON must be formatted as **`"unit_name (Predicted)"`**, for example: `"mg/dL (Predicted)"`.
    4.  **Status Determination Logic (in order of priority):**
        a. If a clear numeric `normal_range` is present, set `status` to "Normal", "High", or "Low".
        b. If `normal_range` is unclear (e.g., contains text), set `status` to "Unknown".
        c. If `normal_range` is missing, you MUST guess a standard range. Then, use that guessed range to set the `status` to **"Normal (Assumed)", "High (Assumed)", or "Low (Assumed)"**.
    5.  **Notes:** Use the `notes` array to document any significant assumptions or ambiguities you encountered during parsing.
    6.  **Plain Language Summary:** The `plain_language_summary` must provide a simple summary for a non-medical person. It MUST NOT provide a diagnosis and MUST end with the sentence: "This summary is for informational purposes only and is not a substitute for professional medical advice."
    """),
    ("human", "{text}")
]

# ---------------------------------------------------- #
prompt_template = ChatPromptTemplate.from_messages(messages) # creating template
chain = prompt_template | llm # creating simple chain
result = chain.invoke({"text": (return_text())}) # invoking the template with text
cleaned_result = (result.content).replace('\\n', '\n') 
if cleaned_result[-1:] != '}':
    cleaned_result += '}'
print(cleaned_result)
# ---------------------------------------------------- #

output_path = "output.json"

if os.path.isdir("output.json"):
    shutil.rmtree("output.json")
    
with open(output_path, 'w', encoding='utf-8') as f:
        f.write(cleaned_result)


