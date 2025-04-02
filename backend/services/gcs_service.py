import os
from typing import Optional
from google.cloud import storage
from fastapi import HTTPException
from config.config import GCS_BUCKET_NAME, GCS_CREDENTIALS
import datetime
from logger.logging import get_logger
from services.db_services import create_download_entry

storage_client = storage.Client.from_service_account_json(GCS_CREDENTIALS)
bucket = storage_client.bucket(GCS_BUCKET_NAME)
DOWNLOAD_DIR = "offline_content"

# Ensure download directory exists
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)
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

def upload_file_to_gcs(file, content_type: str, 
                      file_path: Optional[str]=None,
                      bucket_name: Optional[str] = None,
                      metadata: Optional[dict] = None) -> dict:
    
    try:
        bucket = storage_client.bucket(bucket_name)
        # Upload the file to GCS
        logger.debug(f"Attempting to upload file to GCS: {file_path}")
        blob = bucket.blob(file_path)
        
        # Set metadata if provided
        if metadata:
            blob.metadata = metadata
            
        blob.upload_from_file(file.file, content_type=content_type)

        # Return the file URL
        gs_url = f"gs://{bucket_name}/{file.filename}"
        https_url = f"https://storage.googleapis.com/{bucket_name}/{file.filename}"

        return {"gs_url": gs_url, "https_url": https_url}
    except Exception as e:
        logger.error(f"Failed to upload file to GCS: {file_path}, error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload file to GCS: {str(e)}")
    

def get_user_download_path(username: str, filename: str) -> str:
    user_dir = os.path.join(DOWNLOAD_DIR, username)
    if not os.path.exists(user_dir):
        os.makedirs(user_dir)
    return os.path.join(user_dir, filename)

def generate_signed_url(blob_name):
    blob = bucket.blob(blob_name)
    url = blob.generate_signed_url(expiration=datetime.timedelta(hours=1))
    return url

def find_blob(user_class: str, filename: str):
    prefix = f"class/class {user_class}/Subjects/"
    blobs = list(bucket.list_blobs(prefix=prefix))

    for blob in blobs:
        parts = blob.name.split("/")
        if len(parts) >= 8 and parts[7] == filename:
            return blob
    return None


def download_from_gcs(user_class: str, filename: str, username: str):
    try:
        blob = find_blob(user_class, filename)

        if not blob:
            raise HTTPException(status_code=404, detail="File not found")

        signed_url = generate_signed_url(blob.name)
        create_download_entry(username, filename)

        return {"signed_url": signed_url}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


