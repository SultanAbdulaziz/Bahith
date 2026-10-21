from fastapi import APIRouter, Depends
from .models import uploadRequest
import src.storage.service as storageService
from src.auth.middleware import authorizeUser
from . import service as fileService
from db.session import get_db
from sqlalchemy.orm import Session
import uuid


fileRouter = APIRouter(prefix="/files")

@fileRouter.post("", status_code=201)
def upload(body: uploadRequest, user_id: uuid.UUID = Depends(authorizeUser), db: Session = Depends(get_db)):
    (file_id, upload_url) = fileService.createUpload(db, user_id, body.content_type, body.size_bytes)  #R2 cost guard
    return {
        "success": True,
        "file_id": file_id,
        "upload_url": upload_url
    }

@fileRouter.post("/{file_id}/complete", status_code=204)
def complete(file_id: uuid.UUID, user_id: uuid.UUID = Depends(authorizeUser), db: Session = Depends(get_db)):
    fileService.completeUpload(db, user_id, file_id)

@fileRouter.get("")
def getfiles(user_id: uuid.UUID = Depends(authorizeUser), db: Session = Depends(get_db)):
    return [row._asdict() for row in fileService.getFiles(db, user_id)]

@fileRouter.get("/{file_id}/url")
def getfile(file_id:uuid.UUID, user_id: uuid.UUID = Depends(authorizeUser), db: Session = Depends(get_db)):
    return fileService.getFile(db, user_id, file_id) 

@fileRouter.delete("/{file_id}", status_code=204)
def delete(file_id:uuid.UUID, user_id: uuid.UUID = Depends(authorizeUser), db: Session = Depends(get_db)):
    fileService.deleteFile(db, user_id, file_id)
