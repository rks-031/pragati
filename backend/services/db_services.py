import datetime
from typing import Dict
from bson import ObjectId
from pymongo import MongoClient
from config.config import DB_NAME, MONGODB_URI



client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
users_collection = db["users"]
otps_collection = db["otps"]
downloads_collection = db["user_downloads"]
reports_collection = db["user_reports"]
EXPIRY_SECONDS=datetime.timedelta(days=7)

def get_user_by_phone(phone: str):
    return users_collection.find_one({"parent_phone": phone})
def get_user_by_apaar_id(apaar_id: str):
    return users_collection.find_one({"apaar_id": apaar_id})

def insert_user(user_data: Dict):
    return users_collection.insert_one(user_data)

def insert_otp(otp_data: Dict):
    return otps_collection.insert_one(otp_data)

def get_otp(data: Dict):
    otp_doc = otps_collection.find_one({
        "phone": data.phone,
        "otp": data.otp,
        # Ensure OTP hasn't expired
        "created_at": {
            "$gte": datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=5)
        }
    })
    return otp_doc

def update_user(query: Dict, update: Dict):
    return users_collection.update_one(query, update) 
 
def delete_otps(id: str):
    return  otps_collection.delete_one({"_id": ObjectId(id)})

def check_username_exists(username: str) -> bool:
    return users_collection.find_one({"username": username}) is not None

def create_download_entry(username: str, filename: str):
    download_entry = {
        "username": username,
        "filename": filename,
        "created_at": datetime.datetime.now(datetime.timezone.utc),
        "status": "downloaded"
    }
    downloads_collection.insert_one(download_entry)
    print(f"Logged {filename} download for {username}.")

def is_file_already_downloaded(username: str, filename: str) -> bool:
    download_entry = downloads_collection.find_one({
        "username": username,
        "filename": filename, 
        "created_at": {"$gte":datetime.datetime.now(datetime.timezone.utc) - EXPIRY_SECONDS}
    })
    return download_entry is not None

def make_score_entry(assessment_id: str, user_id: str, score: str):
    score_entry = {
        "assessment_id": assessment_id,
        "user_id": user_id,
        "score": score,
        "created_at": datetime.datetime.now(datetime.timezone.utc),
        "updated_at": datetime.datetime.now(datetime.timezone.utc)
    }
    reports_collection.insert_one(score_entry)

def get_user_report(user_id: str):
    scores = reports_collection.find({"user_id": user_id})
    return list(scores)

def get_user_report_specific_exam(user_id: str, assessment_id: str):
    return reports_collection.find_one({"user_id": user_id, "assessment_id": assessment_id})
