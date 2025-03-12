
import random
from typing import Dict, Optional
from fastapi import APIRouter, HTTPException, Query, Response, UploadFile, Request
import datetime
from db.models import ForgotPasswordModel, LoginModel, RegisterModel, ResetPasswordModel
from services.sms_service import send_sms
from services.db_services import delete_otps, get_otp, get_user_by_phone, insert_otp, insert_user, update_user
from utils.utils import create_jwt_token, hash_pin, verify_pin



router = APIRouter(tags=["Auth"])



@router.post("/register")
async def register(user: RegisterModel):
    # Check if the user already exists by parent's phone number
    existing =  get_user_by_phone(user.parent_phone)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_pin = hash_pin(user.pin)
    user_data = user.model_dump()
    user_data["pin"] = hashed_pin
    insert_user(user_data)
    return {"msg": "User registered successfully"}

@router.post("/login")
async def login(user: LoginModel, response: Response):
    # Look up the user by parent's phone number
    existing = get_user_by_phone(user.phone)
    if not existing or not verify_pin(user.pin, existing["pin"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = create_jwt_token(str(existing["_id"]))
    # Set JWT in an HTTP‑only cookie
    response.set_cookie(
        key="access_token", 
        value=token, 
        httponly=True, 
        secure=False  # Set secure=True in production when using HTTPS
    )
    return {"msg": "Login successful"}

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordModel):
    # Verify that the user exists
    existing = get_user_by_phone(data.phone)
    if not existing:
        raise HTTPException(status_code=400, detail="User not found")
    
    # Generate a 6-digit OTP and store it with a creation timestamp
    otp = str(random.randint(100000, 999999))
    otp_data = {
        "phone": data.phone,
        "otp": otp,
        "created_at": datetime.datetime.utcnow()
    }
    insert_otp(otp_data)
    
    # Send the OTP via SMS using the Twilio service
    try:
        message_sid = send_sms(data.phone, otp)
    except Exception as e:
        # Optionally, remove the stored OTP or handle the error appropriately
        #todo handle error
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"msg": "OTP sent to your registered phone number", "message_sid": message_sid}



@router.post("/reset-password")
async def reset_password(data: ResetPasswordModel):
    # Retrieve the OTP document
    otp_doc = get_otp(data)
    if not otp_doc:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    if datetime.datetime.now(datetime.timezone.utc) - otp_doc["created_at"] > datetime.timedelta(minutes=5):
        raise HTTPException(status_code=400, detail="OTP expired")
    
    hashed_pin = hash_pin(data.new_pin)
    update_user({"parent_phone": data.phone}, {"pin": hashed_pin})
   
    # Remove the OTP document after a successful password reset
    delete_otps(str(otp_doc["_id"]))
    return {"msg": "PIN updated successfully"}