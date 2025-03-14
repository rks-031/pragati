
import random
from typing import Dict, Optional
from venv import logger
from fastapi import APIRouter, HTTPException, Query, Response, UploadFile, Request
import datetime


from services.gcs_service import fetch_course_content




router = APIRouter(tags=["Course"])

from fastapi import HTTPException

@router.get("/courses")
def get_courses(request: Request):
    user_class = request.state.user_class
    try:
        course_link = fetch_course_content(user_class)
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error fetching course link: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return course_link
