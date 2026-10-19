import uuid
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from db.models import Document, Video, InvertedIndex


def getDocuments(db: Session, user_id: uuid.UUID) -> list[Document]:
    rows = db.execute(
        select(Document)
        .join(Video, Document.video_id == Video.id)
        .where(Video.user_id == user_id)
    ).all()
    return [document for (document,) in rows]


def getTermFrequency(db: Session, user_id: uuid.UUID, terms: list[str]):
    return db.execute(
        select(InvertedIndex, Document.length)
        .join(Document, InvertedIndex.document_id == Document.id)
        .join(Video, Video.id == Document.video_id)
        .where(
            Video.user_id == user_id,
            InvertedIndex.term.in_(terms)
        )
    ).all() 

def getNumberOfDocuments(db: Session, user_id: uuid.UUID):
    return db.execute(
        select(func.count(Document.id), func.avg(Document.length))
        .join(Video, Document.video_id == Video.id)
        .where(Video.user_id == user_id)
    ).one()