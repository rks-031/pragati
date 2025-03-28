
import os
from typing import Optional
from google.cloud import storage
from fastapi import HTTPException
from config.config import GCS_BUCKET_NAME, GCS_CREDENTIALS
import datetime
from logger.logging import get_logger

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
                      bucket_name: Optional[str] = None) -> dict:
    
    try:
        bucket = storage_client.bucket(bucket_name)
        # Upload the file to GCS
        logger.debug(f"Attempting to upload file to GCS: {file_path}")
        blob = bucket.blob(file_path)
        blob.upload_from_file(file.file, content_type=content_type)

        # Return the file URL
        gs_url = f"gs://{bucket_name}/{file.filename}"
        https_url = f"https://storage.googleapis.com/{bucket_name}/{file.filename}"

        return {"gs_url": gs_url, "https_url": https_url}
    except Exception as e:
        logger.error(f"Failed to upload file to GCS: {file_path}, error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload file to GCS: {str(e)}")
    

async def download_from_gcs(user_class: str):
    prefix = f"class/class {user_class}/Subjects/"
    blobs = list(bucket.list_blobs(prefix=prefix))
    
    if not blobs:
        raise HTTPException(status_code=404, detail="No course content found")
    
    downloaded_files = []
    for blob in blobs:
        parts = blob.name.split("/")
        if len(parts) < 8:
            continue
        
        filename = parts[7]
        download_path = os.path.join(DOWNLOAD_DIR, filename)
        
        if filename.lower().endswith(('.mp4', '.mov', '.avi' )):
            blob.download_to_filename(download_path)
            downloaded_files.append(download_path)
            print(f"Downloaded {filename} to {download_path}")
            #del k lie cron job
        else:
            print(f"Skipped {filename}, unsupported format")

    return downloaded_files

