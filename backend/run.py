import uvicorn
from config.config import ENV


if __name__ == "__main__":
    print("ENV:", ENV)
    if ENV == "local":
        reload = True
    else:
        reload = False
    uvicorn.run("main:app", host="127.0.0.0", port=8012, reload=reload)