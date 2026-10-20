from fastapi import APIRouter, FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from src.auth.service import AuthError
from src.auth.routes import authRouter
from src.auth.middleware import authorizeUser
from src.search.routes import searchRouter
from src.file.routes import fileRouter
from src.file.service import FileError
import os

app = FastAPI(title="videoIR")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ["FRONTEND_URL"]],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Main Router (api_router) .include_router() to mount service routers ~Sultan
api_router = APIRouter(prefix="/api")
api_router.include_router(authRouter)
api_router.include_router(searchRouter, dependencies=[Depends(authorizeUser)])
api_router.include_router(fileRouter, dependencies=[Depends(authorizeUser)])

@api_router.get("/health")
def health():
    return {"status": "ok"}

app.include_router(api_router)



@app.exception_handler(AuthError)
def auth_error(request, error):
    return JSONResponse(status_code=401, content={"detail": str(error)})

@app.exception_handler(FileError)
def file_error(request, error):
    return JSONResponse(status_code=400, content={"detail": str(error)})