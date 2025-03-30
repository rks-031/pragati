from apscheduler.schedulers.background import BackgroundScheduler
from logger.logging import get_logger
from services.db_services import delete_expired_downloads

scheduler = BackgroundScheduler()
logger = get_logger(__name__)

import os
import time

DOWNLOAD_DIR = "offline_content"
EXPIRY_DAYS = 7
EXPIRY_SECONDS = EXPIRY_DAYS * 24 * 60 * 60

def cleanup_old_files():
    current_time = time.time()
    if not os.path.exists(DOWNLOAD_DIR):
        print("Download directory not found.")
        return

    for filename in os.listdir(DOWNLOAD_DIR):
        file_path = os.path.join(DOWNLOAD_DIR, filename)
        
        if os.path.isfile(file_path):
            file_age = current_time - os.path.getmtime(file_path)
            if file_age > EXPIRY_SECONDS:
                os.remove(file_path)
                print(f"Deleted {filename} (Age: {file_age / 86400:.2f} days)")
            else:
                print(f"Skipping {filename}, not expired yet.")
        else:
            print(f"{filename} is not a file, skipping.")

def cleanup_old_files_and_db():
    cleanup_old_files()  # Existing function to clean up local files
    delete_expired_downloads()  # New function to clean up expired downloads in the database

def start_scheduler():
    if not scheduler.running:
        scheduler.start()
        logger.info("Scheduler started.")
    scheduler.add_job(cleanup_old_files_and_db, 'interval', days=1, id="cleanup_old_files_and_db", replace_existing=True)

