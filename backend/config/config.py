import os
from dotenv import load_dotenv


load_dotenv()

ENV= os.getenv("ENV", "local")
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "Pragati")

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
JWT_ALGORITHM=os.getenv("JWT_ALGORITHM")
JWT_SECRET=os.getenv("JWT_SECRET")
JWT_EXP_DELTA_SECONDS=os.getenv("JWT_EXP_DELTA_SECONDS")
GCS_BUCKET_NAME=os.getenv("GCS_BUCKET_NAME")
GCS_CREDENTIALS=os.getenv("GCS_CREDENTIALS")
