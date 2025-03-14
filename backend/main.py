from typing import List
from venv import logger
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import jwt
from config import read_yaml
from routes.auth_routes import router as auth_router
from routes.course_routes import router as course_router
from config.config import JWT_ALGORITHM, JWT_SECRET
from fastapi.middleware.cors import CORSMiddleware
from logger.logging import get_logger
logger = get_logger(__name__)
excluded_paths = read_yaml.EXCLUDED_APIS

app = FastAPI()

def is_excluded_path(path: str, method: str, excluded_paths: List[dict]) -> bool:
    path = path.rstrip('/')
    for excluded in excluded_paths:
        excluded_path = excluded.get("path", "").rstrip('/')
        excluded_method = excluded.get("method")
        if method != excluded_method:
            continue
        if path == excluded_path:
            
            return True
        if "{" in excluded_path and "}" in excluded_path:
            path_parts = path.split("/")
            excluded_parts = excluded_path.split("/")
            if len(path_parts) == len(excluded_parts):
                match = True
                for part, excluded_part in zip(path_parts, excluded_parts):
                    if not (excluded_part.startswith("{") and excluded_part.endswith("}")):
                        if part != excluded_part:
                            match = False
                            break
                if match:
                    return True
    return False


class State:
    def __init__(self):
        self.x_request_id=None
        self.user_id = None
        self.auth_call = None
        self.user_class = None

@app.middleware("http")
async def AuthMiddleware(request: Request, call_next):
        path = request.url.path
        method = request.method
        if (
        request.url.path.startswith("/openapi.json")
        or request.url.path.startswith("/favicon.ico")
        or request.url.path.startswith("/docs")
     ):
            logger.debug(f"Skipping session check for {request.url.path}")
            response = await call_next(request)
            return response

        # Skip auth check if path is excluded
        if is_excluded_path(path, method, excluded_paths):
            logger.info(f"Skipping auth check for path: {path}")
            return await call_next(request)

         # Check for the JWT in an HTTP‑only cookie
        token = request.cookies.get("access_token")
        if not token:
            logger.error("Not authenticated")
            return JSONResponse(status_code=401, content={"detail": "Not authenticated"})

        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            logger.info(f"Payload: {payload}")
            request.state.user_id = payload.get("user_id")
            request.state.user_class = payload.get("student_class")
            logger.info(f"Authenticated user: {request.state.user_id}")
        except jwt.ExpiredSignatureError:
            return JSONResponse(status_code=401, content={"detail": "Token expired"})
        except Exception as e:
            return JSONResponse(status_code=401, content={"detail": "Invalid token"})

        return await call_next(request)
        

app.include_router(auth_router, prefix="/api/v1")
app.include_router(course_router, prefix="/api/v1")

app = CORSMiddleware(
    app=app,
   
    allow_origins = ['*'],
    allow_credentials=True,
    allow_methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", 
                    "Authorization", 
                    "withcredentials"
                ] 
    )
