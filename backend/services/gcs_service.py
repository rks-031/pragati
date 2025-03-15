
from google.cloud import storage
from fastapi import HTTPException
from config.config import GCS_BUCKET_NAME, GCS_CREDENTIALS
import datetime
from logger.logging import get_logger

storage_client = storage.Client.from_service_account_json(GCS_CREDENTIALS)
bucket = storage_client.bucket(GCS_BUCKET_NAME)
logger = get_logger(__name__)

def fetch_course_content(user_class: str) -> dict:
    prefix = f"class/class {user_class}/Subjects/"
    blobs = list(bucket.list_blobs(prefix=prefix))
    logger.info(f"Found {len(blobs)} blobs for class: {user_class}")
    
    if not blobs:
        logger.error(f"No course content found for class: {user_class}")
        raise HTTPException(status_code=404, detail="No course content found")
    
    course_content = {}
    
    for blob in blobs:
        parts = blob.name.split("/")
        if len(parts) < 8:
            continue
        
        subject = parts[3]              
        topic = parts[4]                
        module = parts[6]               
        filename = parts[7]             
        
        if subject not in course_content:
            course_content[subject] = {}
        if topic not in course_content[subject]:
            course_content[subject][topic] = {}
        if module not in course_content[subject][topic]:
            course_content[subject][topic][module] = {"videos": [], "notes": []}
        
        file_url = blob.public_url
        
        # Classify the file based on its extension.
        if filename.lower().endswith(".pdf"):
            course_content[subject][topic][module]["notes"].append(file_url)
        elif filename.lower().endswith((".mp4", ".mov", ".avi")):
            course_content[subject][topic][module]["videos"].append(file_url)
        else:
            logger.info(f"Unrecognized file type for blob: {blob.name}")
    
    return {"content": course_content}