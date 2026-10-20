from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db.session import get_db
from src.auth.middleware import authorizeUser
from . import service as searchService
from .engine import bm25_search, boolean_search
from typing import Literal

searchRouter = APIRouter(prefix="/search") # hello


@searchRouter.get("")
def search(
    query: str,
    mode: Literal["boolean", "bm25"] = "bm25",
    k: int = Query(10, ge=1, le=100),
    user_id = Depends(authorizeUser),
    db: Session = Depends(get_db),
):
    userIndex = searchService.getUserIndex(db, user_id)

    if mode == "boolean":
        matches = [(position, None) for position in boolean_search(query, userIndex.index)]
    else:
        matches = bm25_search(query, userIndex.index, userIndex.lengths, k=None)  # all matches, best first
    return {
        "query": query,
        "mode": mode,
        "total": len(matches),
        "results": [{**userIndex.rows[position]._asdict(), "score": score} for position, score in matches[:k]],
    }
