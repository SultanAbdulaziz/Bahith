import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models import Document, File


def getUserDocuments(db: Session, user_id: uuid.UUID):
    return db.execute(
        select(Document.file_id, File.type, Document.text, Document.meta)
        .join(File, Document.file_id == File.id)
        .where(File.user_id == user_id)
    ).all()