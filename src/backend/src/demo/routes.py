from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import Literal
from db.session import get_db
from db.models import File
from db.models.file import FileStatus
from src.file.service import FileError
from src.search import service as searchService
from src.search.engine import bm25_search, boolean_search, create_index, document_lengths
from src.storage import service as storageService
import os
import uuid

demoRouter = APIRouter(prefix="/demo")

@demoRouter.get("")
def demo(
    query: str = "",
    mode: Literal["boolean", "bm25"] = "bm25",
    k: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    demo_user_id = uuid.UUID(os.environ["DEMO_USER_ID"])
    video = db.execute(
        select(File.id, File.storage_key)
        .where(File.user_id == demo_user_id, File.status == FileStatus.DONE)
        .order_by(File.created_at)
    ).first()
    if video is None:
        raise FileError("demo video not found")

    rows, hits, total = [], [], 0
    if query.strip():
        rows = searchService.getUserDocuments(db, demo_user_id)
        corpus = [row.text for row in rows]
        index = create_index(corpus)
        if mode == "boolean":
            matches = boolean_search(query, index)
            total = len(matches)
            hits = [(position, None) for position in matches[:k]]
        else:
            hits = bm25_search(query, index, document_lengths(corpus), k)
            total = len(hits)

    return {
        "query": query,
        "mode": mode,
        "total": total,
        "results": [{**rows[position]._asdict(), "score": score} for position, score in hits],
        "file_id": video.id,
        "video_url": storageService.download_url(video.storage_key),
    }
