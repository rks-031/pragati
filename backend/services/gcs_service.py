
from google.cloud import storage
from fastapi import HTTPException
from config.config import GCS_BUCKET_NAME, GCS_CREDENTIALS
from logger.logging import get_logger
logger = get_logger(__name__)


storage_client = storage.Client.from_service_account_json(GCS_CREDENTIALS)
bucket = storage_client.bucket(GCS_BUCKET_NAME)