import random
from typing import Dict, Optional, Set
from venv import logger
from fastapi import APIRouter, File, HTTPException, Query, Response, UploadFile, Request, Form 
import datetime
import json
from services.gcs_service import fetch_course_content, upload_file_to_gcs
from config.config import GCS_ASSESMENT_BUCKET_NAME
from logger.logging import get_logger

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