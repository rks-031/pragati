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

def get_user_by_phone(phone: str):
    return users_collection.find_one({"parent_phone": phone})
def get_user_by_apaar_id(apaar_id: str):
    return users_collection.find_one({"apaar_id": apaar_id})

def insert_user(user_data: Dict):
    return users_collection.insert_one(user_data)

def insert_otp(otp_data: Dict):
    return otps_collection.insert_one(otp_data)

def get_otp(data: Dict):
    return otps_collection.find_one({"phone": data.phone, "otp": data.otp})

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
        "created_at": datetime.datetime.now(),
        "status": "downloaded"
    }
    downloads_collection.insert_one(download_entry)
    print(f"Logged {filename} download for {username}.")

def is_file_already_downloaded(username: str, filename: str) -> bool:
    download_entry = downloads_collection.find_one({
        "username": username,
        "filename": filename,
        "status": "downloaded",
    })
    return download_entry is not None
