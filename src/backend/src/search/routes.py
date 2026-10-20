from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db.session import get_db
from src.auth.middleware import authorizeUser
from . import service as searchService
from .engine import bm25_search, boolean_search, create_index, document_lengths
from typing import Literal

searchRouter = APIRouter(prefix="/search")


@searchRouter.get("")
def search(
    query: str,
    mode: Literal["boolean", "bm25"] = "bm25",
    k: int = Query(10, ge=1, le=100),
    user_id = Depends(authorizeUser),
    db: Session = Depends(get_db),
):
    rows = searchService.getUserDocuments(db, user_id)
    corpus = [row.text for row in rows]
    index = create_index(corpus)

    if mode == "boolean":
        matches = boolean_search(query, index)
        total = len(matches)
        hits = [(position, None) for position in matches[: k]]
    else:
        hits = bm25_search(query, index, document_lengths(corpus), k)
        total = len(hits)
    return {
        "query": query,
        "mode": mode,
        "total": total,
        "results": [{**rows[position]._asdict(), "score": score} for position, score in hits],
    }
