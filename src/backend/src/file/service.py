import uuid
from sqlalchemy import insert
from sqlalchemy.orm import Session
from db.models import File
from db.models.file import FileStatus
from src.storage import service as storageService

def createUpload(db: Session, user_id: uuid.UUID, content_type:str) -> tuple[uuid.UUID, str]:
    file_id = uuid.uuid7()
    storage_key = f"files/{file_id}"
    db.execute(
        insert(File)
        .values(
            id = file_id,
            user_id=user_id,
            type=content_type,
            storage_key=storage_key
            status=FileStatus
        )
    )