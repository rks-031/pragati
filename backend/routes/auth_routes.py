import random
from typing import Dict, Optional
from venv import logger
from fastapi import APIRouter, HTTPException, Query, Response, UploadFile, Request  # type: ignore
import datetime
from db.models import ForgotPasswordModel, LoginModel, RegisterModel, ResetPasswordModel
from services.db_services import delete_otps, get_otp, get_user_by_apaar_id, get_user_by_phone, insert_otp, insert_user, update_user
from utils.utils import create_jwt_token, generate_unique_username, hash_pin, verify_pin
from services.aws_sms_service import AWSSMSService

router = APIRouter(tags=["Auth"])

# Initialize SMS service
sms_service = AWSSMSService()

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
    user_data["username"]=generate_unique_username(user_data["name"])
    insert_user(user_data)
    return {"msg": "User registered successfully"}

@router.post("/login")
async def login(user: LoginModel, response: Response):
    logger.info(f"Processing login request for role: {user.role}")

    if user.role == "student":
        logger.info(f"Looking up student with phone: {user.phone}")
        existing = get_user_by_phone(user.phone)
    elif user.role == "teacher":
        logger.info(f"Looking up teacher with APAAR ID: {user.apaar_id}")
        existing = get_user_by_apaar_id(user.apaar_id)
    else:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    if not existing:
        logger.error(f"User not found for role: {user.role}")
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Debug PIN verification
    logger.info(f"Stored PIN (hashed): {existing['pin']}")
    logger.info(f"Entered PIN (raw): {user.pin}")

    if not verify_pin(user.pin, existing["pin"]):
        logger.error("PIN verification failed")
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    qualification = existing.get("qualification", "N/A")  # Ensure qualification is retrieved

    token = create_jwt_token(
        str(existing["_id"]),
        existing.get("student_class", "N/A"),
        existing["name"],
        existing["role"],
        qualification,
        existing.get("username", "N/A")  
    )
    
    response.set_cookie(
        key="access_token",
        value=token,
        secure=True,
        httponly=True,
        samesite="None"
    )
    
    return {
        "msg": "Login successful",
        "name": existing["name"],
        "access_token": token,
        "role": existing["role"],
        "qualification": qualification,
        "student_class": existing.get("student_class", None) if user.role == "student" else None  # Include student class
    }

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordModel):
    try:
        existing = get_user_by_phone(data.phone)
        if not existing:
            raise HTTPException(status_code=400, detail="User not found")

        otp = str(random.randint(100000, 999999))
        otp_data = {
            "phone": data.phone,
            "otp": otp,
            # Store with UTC timezone
            "created_at": datetime.datetime.now(datetime.timezone.utc)
        }
        
        insert_otp(otp_data)

        try:
            result = sms_service.send_sms(data.phone, otp)
            return {"msg": "OTP sent to your registered phone number", "message_id": result['message_id']}
        except Exception as e:
            print(f"SMS sending error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to send SMS: {str(e)}")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/reset-password")
async def reset_password(data: ResetPasswordModel):
    try:
        # Retrieve the OTP document
        otp_doc = get_otp(data)
        if not otp_doc:
            raise HTTPException(status_code=400, detail="Invalid OTP")

        # Compare timestamps with proper timezone awareness
        current_time = datetime.datetime.now(datetime.timezone.utc)
        otp_time = otp_doc["created_at"]
        
        # Ensure OTP time has timezone info
        if otp_time.tzinfo is None:
            otp_time = otp_time.replace(tzinfo=datetime.timezone.utc)
            
        if current_time - otp_time > datetime.timedelta(minutes=5):
            delete_otps(str(otp_doc["_id"]))  # Clean up expired OTP
            raise HTTPException(status_code=400, detail="OTP expired")

        # Update user's PIN
        hashed_pin = hash_pin(data.new_pin)
        result = update_user({"parent_phone": data.phone}, {"$set": {"pin": hashed_pin}})
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Failed to update PIN")

        # Clean up used OTP
        delete_otps(str(otp_doc["_id"]))
        return {"msg": "PIN updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Reset password error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout")
async def logout(response: Response):
    print("in logout")
    try:
        response.delete_cookie("access_token")
        return {"msg": "Logged out successfully"}
    except Exception as e:
        logger.error(f"Failed to log out: {e}")
        raise HTTPException(status_code=500, detail=str(e))
