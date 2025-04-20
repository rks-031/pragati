import random
from typing import Dict, List, Optional, Set
from venv import logger
from fastapi import APIRouter, File, HTTPException, Query, Response, UploadFile, Request, Form 
import datetime
import json
from db.models import AnswerSubmission
from utils.utils import parse_extracted_text
from services.db_services import get_user_report, get_user_report_specific_exam, make_score_entry
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

            try:
                chapters = json.loads(assessment.get("chapters", "[]"))
            except json.JSONDecodeError:
                chapters = []  # Default to an empty list if parsing fails

            assessment_id = doc.id
            start_date = assessment.get("start_date")
            end_date = assessment.get("end_date")
            user_attempt = user_attempt_map.get(assessment_id)
            is_attempted = user_attempt is not None


            assessment_data = {
                "id": assessment_id,
                "subject": assessment.get("subject"),

                "chapters": chapters,
                "start_date": assessment.get("start_date"),
                "end_date": assessment.get("end_date"),

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
        raise HTTPException(status_code=500, detail="Failed to fetch assessments")


@router.get("/get_quiz/{assessment_id}")
async def get_quiz(request: Request,assessment_id: str):
    user_id= request.state.user_id
    #check if user has previouslt attempted the quiz
    user_scores = get_user_report_specific_exam(user_id, assessment_id)
    if user_scores:
        raise HTTPException(status_code=403, detail="You have already attempted this quiz")
    
    try:
        db = firestore.Client()
        doc = db.collection("Question_papers").document(assessment_id).get()
        #
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Quiz not found")
        #check if quiz is expired
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
     
        quiz_data = doc.to_dict()
        end_date= quiz_data.get("end_date")
        if end_date < current_date:
            raise HTTPException(status_code=403, detail="Quiz has expired")
        return {
            "status": "success",
            "extracted_text": quiz_data.get("extracted_text", ""),
            "subject": quiz_data.get("subject"),
            "duration": 3600  # 1 hour in seconds
        }
    except Exception as e:
        logger.error(f"Error fetching quiz: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/submit_quiz/{assessment_id}")
async def submit_quiz(
    request: Request,
    assessment_id: str,
    submissions: List[AnswerSubmission]
):
    user_id = request.state.user_id
    


    try:
        db = firestore.Client()
        doc = db.collection("Question_papers").document(assessment_id).get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Assessment not found")

        quiz_data = doc.to_dict()
        extracted_text = quiz_data.get("extracted_text", "")
        logger.info(f"Extracted text: {extracted_text}")

        parsed_questions = parse_extracted_text(extracted_text)  # You must define this
        total=len(parsed_questions)
        logger.info(f"Parsed questions: {parsed_questions}")

        score = 0
        # total = len(submissions)
        result_detail = []

        for submission in submissions:
            q_index = submission.questionIndex
            selected = submission.selected.upper()
            correct = parsed_questions[q_index]["answer"]
            is_correct = selected == correct
            if is_correct:
                score += 1
            result_detail.append({
                "question": parsed_questions[q_index]["question"],
                "selected": selected,
                "correct": correct,
                "isCorrect": is_correct
            })

        make_score_entry(assessment_id, user_id, score,total)

        score_str = f"{score}/{total}"

        return {
            "status": "success",
            "score_num": score,
            "score": score_str,
            "results": result_detail
        }

    except Exception as e:
        logger.error(f"Error submitting quiz: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/get_quiz_result/{assessment_id}")
async def get_quiz_result(request: Request, assessment_id: str):
    user_id = request.state.user_id
    user_scores = get_user_report_specific_exam(user_id, assessment_id)
    if not user_scores:
        raise HTTPException(status_code=404, detail="No quiz results found")
    
    score_str = user_scores.get("score")
    score_out_of_str = user_scores.get("score_out_of")
    if not score_out_of_str:
        score_out_of_str = "25"
    score_num = int(score_str)
    score_out_of_num = int(score_out_of_str)
    percentage = (score_num / score_out_of_num) * 100

    return {
        "score": score_num,
        "percentage": percentage,
        "score_out_of": score_out_of_num,
    }
    
@router.get("/user/result")
def get_user_result(request: Request):
   
    user_id = request.state.user_id
    user_scores = get_user_report(user_id)
    if not user_scores:
        raise HTTPException(status_code=404, detail="No quiz results found")
    total_exams = len(user_scores)
    passed_exams = 0
    failed_exams = 0
    for score in user_scores:
        score_str = score.get("score")
        score_out_of_str = score.get("score_out_of")
        if not score_out_of_str:
            score_out_of_str = "25"
        score_num = int(score_str)
        score_out_of_num = int(score_out_of_str)
        percentage = (score_num / score_out_of_num) * 100
        if percentage >= 35:
            passed_exams += 1
        else:
            failed_exams += 1
    grade = ""
    if passed_exams / total_exams >= 0.8:
        grade = "A"
    elif passed_exams / total_exams >= 0.6:
        grade = "B"
    elif passed_exams / total_exams >= 0.4:
        grade = "C"
    else:
        grade = "D"

    return {
        "total_exams": total_exams,
        "passed_exams": passed_exams,
        "failed_exams": failed_exams,
        "Grade":grade,
    }

    