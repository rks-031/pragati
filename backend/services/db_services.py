from typing import Dict
from bson import ObjectId
from pymongo import MongoClient
from config.config import DB_NAME, MONGODB_URI


client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
users_collection = db["users"]
otps_collection = db["otps"]

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

