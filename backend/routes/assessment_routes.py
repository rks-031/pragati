import random
from typing import Dict, Optional, Set
from venv import logger
from fastapi import APIRouter, File, HTTPException, Query, Response, UploadFile, Request, Form 
import datetime
import json
from services.db_services import get_user_report, make_score_entry
from services.gcs_service import fetch_course_content, upload_file_to_gcs
from config.config import GCS_ASSESMENT_BUCKET_NAME
from logger.logging import get_logger
from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

logger = get_logger(__name__)

# Define allowed file types
ALLOWED_FILE_TYPES: Set[str] = {
    'application/pdf',  # PDF
    'application/msword',  # DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  # DOCX
}

router = APIRouter(tags=["Assessment"])

@router.post("/upload_assessment")
async def upload_assessment(
    request: Request,
    file: UploadFile = File(...),
    start_date: str = Form(...),
    end_date: str = Form(...),
    class_name: str = Form(...),  # This matches the frontend
    subject: str = Form(...),
    chapters: str = Form(...)  # Expect JSON string array
):  
    try:
        # Check file type
        if file.content_type not in ALLOWED_FILE_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Only PDF, DOC, and DOCX files are allowed"
            )

        # Parse chapters from JSON string
        chapters_list = json.loads(chapters)
        
        # Create metadata
        metadata = {
            "start_date": start_date,
            "end_date": end_date,
            "class": class_name,  # Store as 'class' in metadata
            "subject": subject,
            "chapters": chapters_list
        }

        # Upload file with metadata
        filepath = f"{file.filename}"
        file_urls = upload_file_to_gcs(
            file=file, 
            content_type=file.content_type,
            bucket_name=GCS_ASSESMENT_BUCKET_NAME,
            file_path=filepath,
            metadata=metadata
        )
        return {"file_urls": file_urls, "metadata": metadata}
    except HTTPException as he:
        logger.error(f"Error uploading assessment: {he}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error uploading assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get_assessments/{class_id}")
async def get_assessments(request: Request, class_id: str):
    try:
        db = firestore.Client()
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
        user_id = request.state.user_id

        # Fetch assessments for class
        assessments_ref = db.collection("Question_papers")
        query = assessments_ref.where(filter=FieldFilter("class", "==", class_id))
        docs = query.stream()

        # Fetch MongoDB scores for user
        user_scores = get_user_report(user_id)
        user_attempt_map = {score["assessment_id"]: score for score in user_scores}

        # Prepare 4 categories
        past_attempted = []
        expired = []
        active = []
        upcoming = []

        for doc in docs:
            assessment = doc.to_dict()
            assessment_id = doc.id
            start_date = assessment.get("start_date")
            end_date = assessment.get("end_date")
            user_attempt = user_attempt_map.get(assessment_id)
            is_attempted = user_attempt is not None

            assessment_data = {
                "id": assessment_id,
                "subject": assessment.get("subject"),
                "chapters": eval(assessment.get("chapters", "[]")),
                "start_date": start_date,
                "end_date": end_date,
                "file_name": assessment.get("file_name"),
                "score": user_attempt.get("score") if is_attempted else "00/10",
                "attempted": is_attempted
            }

            if is_attempted:
                past_attempted.append(assessment_data)
            elif start_date > current_date:
                upcoming.append(assessment_data)
            elif start_date <= current_date <= end_date:
                active.append(assessment_data)
            elif end_date < current_date:
                expired.append(assessment_data)

        return {
            "status": "success",
            "data": {
                "past_attempted": past_attempted,
                "expired": expired,
                "active": active,
                "upcoming": upcoming
            }
        }

    except Exception as e:
        logger.error(f"Error fetching assessments: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get_quiz/{assessment_id}")
async def get_quiz(request: Request,assessment_id: str):
    user_id= request.state.user_id
    
    try:
        db = firestore.Client()
        doc = db.collection("Question_papers").document(assessment_id).get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Quiz not found")
        #check if quiz is expired
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
     
        quiz_data = doc.to_dict()
        end_date= quiz_data.get("end_date")
        if end_date < current_date:
            raise HTTPException(status_code=400, detail="Quiz has expired")
        return {
            "status": "success",
            "extracted_text": quiz_data.get("extracted_text", ""),
            "subject": quiz_data.get("subject"),
            "duration": 3600  # 1 hour in seconds
        }
    except Exception as e:
        logger.error(f"Error fetching quiz: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mark_assessment_attempted/{assessment_id}")
async def mark_assessment_attempted(request:Request,assessment_id: str, score: str):
    user_id= request.state.user_id
    try:
        db = firestore.Client()
        assessment_ref = db.collection("Question_papers").document(assessment_id)
        
        # Update the assessment document
        assessment_ref.update({
            "attempted": True,
            "score": score,
            "attempt_date": datetime.datetime.now().strftime("%Y-%m-%d")
        })
        make_score_entry(assessment_id, user_id, score)
        # Create a new document in the Scores collection
        
        return {"status": "success", "message": "Assessment marked as attempted"}
    except Exception as e:
        logger.error(f"Error marking assessment as attempted: {e}")
        raise HTTPException(status_code=500, detail=str(e))