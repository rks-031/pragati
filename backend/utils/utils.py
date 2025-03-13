import datetime
from passlib.context import CryptContext
import jwt
from config.config import JWT_ALGORITHM, JWT_EXP_DELTA_SECONDS, JWT_SECRET




pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



def hash_pin(pin: str) -> str:
    return pwd_context.hash(pin)

def verify_pin(plain_pin: str, hashed_pin: str) -> bool:
    return pwd_context.verify(plain_pin, hashed_pin)

def create_jwt_token(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(seconds=int(JWT_EXP_DELTA_SECONDS))
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token