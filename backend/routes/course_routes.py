
import random
from typing import Dict, Optional
from fastapi import APIRouter, HTTPException, Query, Response, UploadFile, Request
import datetime




router = APIRouter(tags=["Course"])

@router.get("/courses")
def get_courses(request: Request):
    user_class=request.state.user_class
    return {"courses": "List of courses"}