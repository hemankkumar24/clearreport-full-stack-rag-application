import os
import shutil                                          # to delete file
from dotenv import load_dotenv                         # load .env
from sentence_transformers import SentenceTransformer  # for vector embeddings
from langchain_core.prompts import ChatPromptTemplate  # prompt template
from langchain_community.chat_models import ChatOllama # ollama model 
from testing import return_status
import json                                             
# ---------------------------------------------------- #

model = SentenceTransformer('all-MiniLM-L6-v2')        # sentence transformer model

llm = ChatOllama(
    model="llama3.2", 
    temperature=0  
)
def get_llm_response(text_extracted):
    messages = [
        ("system", """
        You are a highly intelligent and precise medical report parser. Your task is to extract a **single, strictly valid JSON object** from potentially noisy OCR text.

        ⚠️ Output Constraints:
        - Your output MUST be a valid JSON object — not a string, not markdown — just JSON.
        - You MUST NOT include any commentary, explanation, or extra formatting — ONLY the raw JSON object.

        ✅ Output Format:
        {{
          "patient": {{
            "name": "John Doe",
            "age": 45,
            "gender": "Male"
          }},
          "tests": [
            {{
              "name": "Hemoglobin",
              "result": 14.8,
              "unit": "g/dL",
              "normal_range": [13.5, 17.5]
            }},
            {{
              "name": "Blood Urea",
              "result": 22,
              "unit": "mg/dL (Predicted)",
              "normal_range": [10, 40]
            }}
          ],
          "remarks": [
            "Lipid profile within acceptable limits.",
            "No abnormal findings in radiological scans."
          ],
          "doctor": {{
            "name": "Dr. Neha Kapoor"
          }},
          "notes": [
            "Inferred unit for 'Blood Urea' as mg/dL.",
            "Converted '4,000' to 4000."
          ],
          "plain_language_summary": "This report contains your recent test results. Most values appear within normal range. This summary is for informational purposes only and is not a substitute for professional medical advice."
        }}

        🧠 Extraction & Formatting Rules:
        1. If OCR text is unintelligible or empty, return `{{}}`.
        2. Convert all dates to `YYYY-MM-DD`.
        3. If unit is missing, predict it and add `" (Predicted)"` (e.g., `"mg/dL (Predicted)"`).
        4. All test entries must be flat (not nested). Each test must be a single object with:
          - `"name"` (string)
          - `"result"` (number or string)
          - `"unit"` (string or null)
          - `"normal_range"` (array of two numbers or null)
          ✅ Example:
          {{
            "name": "Test Name",
            "result": 87,
            "unit": "mg/dL",
            "normal_range": [70, 110]
          }}
        5. If any result or range is written like "4-10", convert it to: `[4, 10]` (array).
        6. If a value uses a symbol like `<130`, keep it **as a string**.
        7. If a number has commas (e.g., `"4,000"`), convert it to plain number (e.g., `4000`).
        8. If a value is missing or empty, use `null` instead of `""`.
        9. DO NOT group tests under any structure like `"result"`: the entire `"tests"` array must be flat and contain **independent objects** only.
        10. Each `result` should be a **single test**, not multiple combined tests.

        ❌ INVALID:
        "tests": [
          {{
            "Hemoglobin": {{
              "result": 14.8,
              "unit": "g/dL"
            }}
          }}
        ]

        ✅ VALID:
        "tests": [
          {{
            "name": "Hemoglobin",
            "result": 14.8,
            "unit": "g/dL",
            "normal_range": [13.5, 17.5]
          }}
        ]

        Make NO assumptions about patient names or gender if missing — use `null`.
        """),
        ("human", "{text}")
    ]

    # ---------------------------------------------------- #
    prompt_template = ChatPromptTemplate.from_messages(messages) # creating template
    chain = prompt_template | llm # creating simple chain
    result = chain.invoke({"text": text_extracted}) # invoking the template with text
    cleaned_result = (result.content).replace('\\n', '\n') 
    if cleaned_result[-1:] != '}': 
        cleaned_result += '}'
    print(cleaned_result)
    # ---------------------------------------------------- #

    cleaned_result_status = return_status(cleaned_result)
    
    return cleaned_result_status