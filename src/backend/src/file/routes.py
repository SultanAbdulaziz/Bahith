from fastapi import APIRouter
from models import uploadRequest
import src.storage.service as storageService
from db.models.file import FileStatus

fileRouter = APIRouter(prefix="/files")

@fileRouter.post("/upload URL")
def upload(body: uploadRequest):
    pass

@fileRouter.get("/{file_id}")
def download():
    pass
