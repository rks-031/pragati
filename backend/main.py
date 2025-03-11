from fastapi import FastAPI, Request

app = FastAPI()

@app.get("/ping")
async def ping():
    return {"ping": "pong"}

class State:
    def __init__(self):
        self.x_request_id=None
        self.user_id = None
        self.email = None
        self.session = None
        self.session_type = None 
        self.session_id = None
        self.auth_call = None
        

@app.middleware("http")
async def session_middleware(request: Request, call_next): 
    request_state : State = request.state
    if (
        request.url.path.startswith("/openapi.json")
        or request.url.path.startswith("/favicon.ico")
        or request.url.path.startswith("/docs")
        or request.url.path.startswith("/auth")
       
    ):
            
        response = await call_next(request)
        return response
