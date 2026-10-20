import uuid
from sqlalchemy import insert, update, select, delete
from sqlalchemy.orm import Session
from db.models import File
from db.models.file import FileStatus
from src.storage import service as storageService
from sqlalchemy.exc import NoResultFound

VALID_FILE_TYPES=["video"]

class FileError(Exception):
    pass

def createUpload(db: Session, user_id: uuid.UUID, content_type:str) -> tuple[uuid.UUID, str]:
    if content_type.split("/")[0] not in VALID_FILE_TYPES:
        raise FileError("File type not supported")
    file_id = uuid.uuid7()
    storage_key = f"files/{content_type.split("/")[0]}/{file_id}"
    db.execute(
        insert(File)
        .values(
            id = file_id,
            user_id=user_id,
            type=content_type,
            storage_key=storage_key,
            status=FileStatus.UPLOADING
        )
    )
    db.commit()
    return file_id, storageService.upload_url(storage_key, content_type)

def completeUpload(db: Session, user_id:uuid.UUID, file_id: uuid.UUID):
    try:
        db.execute(
            update(File)
            .values(status = FileStatus.PENDING)
            .where(File.id == file_id, File.user_id == user_id, File.status == FileStatus.UPLOADING)
            .returning(File.id)
        ).one()
        db.commit()
    except NoResultFound:
        raise FileError("file not found")

def getFiles(db: Session, user_id: uuid.UUID):
    return db.execute(
        select(File.id, File.type, File.status, File.meta, File.error, File.created_at)
        .where(File.user_id == user_id)
        .order_by(File.created_at.desc())
    ).all()

def getFile(db: Session, user_id: uuid.UUID, file_id: uuid.UUID):
    try:
        (key,) = db.execute(
            select(File.storage_key)
            .where(File.user_id == user_id, File.id == file_id)
        ).one()
    except NoResultFound:
        raise FileError("file not found")
    return storageService.download_url(key)
    
def deleteFile(db: Session, user_id: uuid.UUID, file_id: uuid.UUID):
    try:
        (key,) = db.execute(
            select(File.storage_key)
            .where(File.user_id == user_id, File.id == file_id)
        ).one()
    except NoResultFound:
        raise FileError("file not found")
    storageService.delete(key)
    db.execute(delete(File).where(File.id == file_id, File.user_id == user_id))
    db.commit()
