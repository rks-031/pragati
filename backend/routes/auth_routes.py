import random
from typing import Dict, Optional
from venv import logger
from fastapi import APIRouter, HTTPException, Query, Response, UploadFile, Request  # type: ignore
import datetime
from db.models import ForgotPasswordModel, LoginModel, RegisterModel, ResetPasswordModel
from services.sms_service import send_sms
from services.db_services import delete_otps, get_otp, get_user_by_apaar_id, get_user_by_phone, insert_otp, insert_user, update_user
from utils.utils import create_jwt_token, hash_pin, verify_pin

router = APIRouter(tags=["Auth"])

def get_role_based_data(user: RegisterModel):
    if user.role.value == "teacher":
        if not all([user.qualification, user.apaar_id, user.phone]):
            raise HTTPException(status_code=400, detail="Missing teacher details")
    elif user.role.value == "student":
        if not all([user.parent_phone, user.student_class]):
            raise HTTPException(status_code=400, detail="Missing student details")
    else:
        raise HTTPException(status_code=400, detail="Invalid role")
    return user

@router.post("/register")
async def register(user: RegisterModel):
    logger.info(f"Received registration data: {user}")
    
    user = get_role_based_data(user)  # Validate role-specific fields
    
    existing = get_user_by_phone(user.parent_phone if user.role.value == "student" else user.phone)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user_data = user.model_dump()
    user_data["pin"] = hash_pin(user.pin)
    insert_user(user_data)
    return {"msg": "User registered successfully"}

@router.post("/login")
async def login(user: LoginModel, response: Response):
    logger.info("Processing login request")
    
    if user.role.value == "student":
        existing = get_user_by_phone(user.phone)
    elif user.role.value == "teacher":
        existing = get_user_by_apaar_id(user.apaar_id)
    else:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    if not existing or not verify_pin(user.pin, existing["pin"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = create_jwt_token(
        str(existing["_id"]),
        existing.get("student_class", "N/A"),
        existing["name"],
        existing["role"]
    )
    
    response.set_cookie(
        key="access_token",
        value=token,
        secure=True,
        httponly=True,
        samesite="None"
    )
    
    return {"msg": "Login successful", "name": existing["name"], "access_token": token, "role": existing["role"]}

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
        # todo handle error
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

@router.post("/logout")
async def logout(response: Response):
    print("in logout")
    try:
        response.delete_cookie("access_token")
        return {"msg": "Logged out successfully"}
    except Exception as e:
        logger.error(f"Failed to log out: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    