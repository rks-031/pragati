import random
from typing import Dict, Optional
from venv import logger

from fastapi import APIRouter, Form, HTTPException, Query, Response, UploadFile, Request 
from services.db_services import is_file_already_downloaded
from services.gcs_service import download_from_gcs, fetch_course_content
from logger.logging import get_logger
logger = get_logger(__name__)

router = APIRouter(tags=["Course"])

def get_allowed_classes(qualification: str) -> range:
    junior_qualifications = ["JUNIOR", "ELEMENTARY", "BED", "DIPLOMA"]
    senior_qualifications = ["TGT", "PGT"]
    
    if qualification in junior_qualifications:
        return range(1, 6)  # Classes 1-5 (fixed range)
    elif qualification in senior_qualifications:
        return range(6, 11)  # Classes 6-10
    else:
        raise HTTPException(status_code=403, detail="Invalid qualification")

@router.get("/courses")
def get_courses(request: Request):
    print("in get_courses")
    role = request.state.role
    
    if role == "student":
        user_class = request.state.user_class
        print(f"user_class {user_class}")
        try:
            course_content = fetch_course_content(user_class)
            return course_content
        except HTTPException as he:
            raise he
        except Exception as e:
            logger.error(f"Unexpected error fetching course content: {e}")
            raise HTTPException(status_code=500, detail=str(e))
            
    elif role == "teacher":
        qualification = request.state.qualification
        if not qualification:
            raise HTTPException(status_code=400, detail="Teacher qualification not found")
            
        allowed_classes = get_allowed_classes(qualification)
        try:
            all_courses = {}
            for class_num in allowed_classes:
                try:
                    class_content = fetch_course_content(str(class_num))
                    if class_content and "content" in class_content:
                        # Store each class's content in the all_courses dictionary
                        all_courses[str(class_num)] = class_content["content"]
                except Exception as e:
                    logger.error(f"Error processing class {class_num}: {e}")
                    continue

            if not all_courses:
                raise HTTPException(status_code=404, detail="No courses found for the given qualification")
            #print(all_courses)
            return {"content": all_courses}
        except Exception as e:
            logger.error(f"Unexpected error fetching courses for teacher: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    else:
        raise HTTPException(status_code=403, detail="Invalid role")
    


@router.post("/download")
def download_course_content(request: Request, file_name: str = Form(...)):
    username = request.state.username  
    user_class = request.state.user_class
    if is_file_already_downloaded(username, file_name):
        raise HTTPException(status_code=400, detail="File already downloaded within the last 7 days")
    
    try:
        signed_url = download_from_gcs(user_class, file_name, username)
        return {"message": "Download successful", "file_path": signed_url}
    except HTTPException as e:
        return {"message": str(e)}