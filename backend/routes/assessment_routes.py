import random
from typing import Dict, Optional, Set
from venv import logger
from fastapi import APIRouter, File, HTTPException, Query, Response, UploadFile, Request, Form 
import datetime
import json
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
async def get_assessments(class_id: str):
    try:
        db = firestore.Client()
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
        
        assessments_ref = db.collection("Question_papers")
        query = assessments_ref.where(filter=FieldFilter("class", "==", class_id))
        docs = query.stream()

        previous_assessments = []
        active_assessments = []
        upcoming_assessments = []

        for doc in docs:
            assessment = doc.to_dict()
            assessment_data = {
                "id": doc.id,
                "subject": assessment.get("subject"),
                "chapters": eval(assessment.get("chapters", "[]")),
                "start_date": assessment.get("start_date"),
                "end_date": assessment.get("end_date"),
                "file_name": assessment.get("file_name"),
                "score": assessment.get("score", "00/10"),
                "attempted": assessment.get("attempted", False)
            }

            # Categorize based on dates and attempt status
            if assessment.get("attempted", False):
                previous_assessments.append(assessment_data)
            elif assessment["start_date"] > current_date:
                upcoming_assessments.append(assessment_data)
            elif (assessment["start_date"] <= current_date and 
                  assessment["end_date"] >= current_date):
                active_assessments.append(assessment_data)
            else:
                previous_assessments.append(assessment_data)

        return {
            "status": "success",
            "data": {
                "previous_assessments": previous_assessments,
                "active_assessments": active_assessments,
                "upcoming_assessments": upcoming_assessments
            }
        }

    except Exception as e:
        logger.error(f"Error fetching assessments: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get_quiz/{assessment_id}")
async def get_quiz(assessment_id: str):
    try:
        db = firestore.Client()
        doc = db.collection("Question_papers").document(assessment_id).get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Quiz not found")
            
        quiz_data = doc.to_dict()
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
async def mark_assessment_attempted(assessment_id: str, score: str):
    try:
        db = firestore.Client()
        assessment_ref = db.collection("Question_papers").document(assessment_id)
        
        # Update the assessment document
        assessment_ref.update({
            "attempted": True,
            "score": score,
            "attempt_date": datetime.datetime.now().strftime("%Y-%m-%d")
        })
        
        return {"status": "success", "message": "Assessment marked as attempted"}
    except Exception as e:
        logger.error(f"Error marking assessment as attempted: {e}")
        raise HTTPException(status_code=500, detail=str(e))