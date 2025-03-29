import datetime
import os
from typing import Optional
from passlib.context import CryptContext # type: ignore
import jwt # type: ignore
from config.config import JWT_ALGORITHM, JWT_EXP_DELTA_SECONDS, JWT_SECRET
from services.db_services import check_username_exists

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_pin(pin: str) -> str:
    return pwd_context.hash(pin)

def verify_pin(plain_pin: str, hashed_pin: str) -> bool:
    return pwd_context.verify(plain_pin, hashed_pin)

def create_jwt_token(user_id: str, student_class: str, name: str, role: str, qualification: Optional[str] = None):
    payload = {
        "user_id": user_id,
        "student_class": student_class,
        "name": name,
        "role": role,
        "qualification": qualification,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
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