import datetime
from passlib.context import CryptContext # type: ignore
import jwt # type: ignore
from config.config import JWT_ALGORITHM, JWT_EXP_DELTA_SECONDS, JWT_SECRET

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_pin(pin: str) -> str:
    return pwd_context.hash(pin)

def verify_pin(plain_pin: str, hashed_pin: str) -> bool:
    return pwd_context.verify(plain_pin, hashed_pin)

def create_jwt_token(user_id: str, student_class: str, name: str,role:str):
    payload = {
        "user_id": user_id,
        "student_class": student_class,
        "name": name,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        "role":role
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
