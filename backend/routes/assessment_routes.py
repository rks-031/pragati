
import random
from typing import Dict, Optional
from venv import logger
from fastapi import APIRouter, File, HTTPException, Query, Response, UploadFile, Request 
import datetime
from services.gcs_service import fetch_course_content, upload_file_to_gcs
from config.config import GCS_ASSESMENT_BUCKET_NAME
from logger.logging import get_logger
logger = get_logger(__name__)


router = APIRouter(tags=["Assessment"])
@router.post("/upload_assessment")
async def upload_assessment(request: Request, file: UploadFile = File(...)):  
    try:
        filepath=f"{file.filename}"
        file_urls = upload_file_to_gcs(file, file.content_type,bucket_name=GCS_ASSESMENT_BUCKET_NAME,file_path=filepath)
        return {"file_urls": file_urls}
    except HTTPException as he:
            logger.error(f"Error uploading assessment: {he}")
            raise he
    except Exception as e:
            logger.error(f"Unexpected error uploading assessment: {e}")
            raise HTTPException(status_code=500, detail=str(e))
      
   