import datetime
import os
from typing import Optional
from passlib.context import CryptContext # type: ignore
import jwt # type: ignore
from config.config import JWT_ALGORITHM, JWT_EXP_DELTA_SECONDS, JWT_SECRET
from services.db_services import check_username_exists
import re

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_pin(pin: str) -> str:
    return pwd_context.hash(pin)

def verify_pin(plain_pin: str, hashed_pin: str) -> bool:
    return pwd_context.verify(plain_pin, hashed_pin)

def create_jwt_token(user_id: str, student_class: str, name: str, role: str, qualification: Optional[str] = None, username: Optional[str] = None) -> str:
    payload = {
        "user_id": user_id,
        "student_class": student_class,
        "name": name,
        "role": role,
        "qualification": qualification,
        "username": username,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

# def delete_file_after_expiry(file_path: str, expiry_time: int = 7 * 24 * 60 * 60):
#     def delete_file():
#         if os.path.exists(file_path):
#             os.remove(file_path)
#             print(f"File {file_path} deleted after expiry.")
#     Timer(expiry_time, delete_file).start()



def generate_unique_username(base_username: str) -> str:
    username = base_username
    counter = 1
    while check_username_exists(username):
        username = f"{base_username}{counter}"
        counter += 1
    return username



# def parse_questions(raw_text):
#     lines = raw_text.strip().split('\n')
#     questions = []
#     i = 0
#     question_number = 1

#     while i < len(lines):
#         q_match = re.match(rf"{question_number}\.\s*(.*)", lines[i])
#         if q_match:
#             question_text = q_match.group(1).strip()
#             options = []
#             for j in range(1, 5):  # Expecting 4 options
#                 options.append(re.sub(r"^[A-D]\)\s*", "", lines[i + j]).strip())
#             answer_line = lines[i + 5]
#             answer_match = re.match(r"Answer:\s*([A-D])", answer_line)
#             answer = answer_match.group(1) if answer_match else None

#             questions.append({
#                 "question": question_text,
#                 "options": options,
#                 "answer": answer
#             })

#             i += 6  # move to next question
#             question_number += 1
#         else:
#             i += 1  # Skip malformed lines

#     return questions


def parse_extracted_text(text: str):
    pattern = re.compile(
        r"\d+\.\s*(.*?)\n" +  # Question
        r"A\)\s*(.*?)\n" +     # Option A
        r"B\)\s*(.*?)\n" +     # Option B
        r"C\)\s*(.*?)\n" +     # Option C
        r"D\)\s*(.*?)\n" +     # Option D
        r"Answer:\s*([ABCD])", # Answer
        re.DOTALL
    )

    questions = []
    for match in pattern.finditer(text):
        question = match.group(1).strip()
        options = {
            "A": match.group(2).strip(),
            "B": match.group(3).strip(),
            "C": match.group(4).strip(),
            "D": match.group(5).strip()
        }
        answer = match.group(6).strip()

        questions.append({
            "question": question,
            "options": options,
            "answer": answer
        })

    return questions


