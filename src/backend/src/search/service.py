import uuid
from collections import OrderedDict
from collections.abc import Sequence
from dataclasses import dataclass
from typing import Any
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from db.models import Document, File
from .engine import Index, create_index, document_lengths


def getUserDocuments(db: Session, user_id: uuid.UUID):
    return db.execute(
        select(Document.file_id, File.type, Document.text, Document.meta)
        .join(File, Document.file_id == File.id)
        .where(File.user_id == user_id)
        .order_by(Document.id)
    ).all()


def getDocumentsVersion(db: Session, user_id: uuid.UUID) -> tuple[int, int | None]:
    count, max_id = db.execute(
        select(func.count(Document.id), func.max(Document.id))
        .join(File, Document.file_id == File.id)
        .where(File.user_id == user_id)
    ).one()
    return count, max_id


@dataclass
class UserIndex:
    version: tuple[int, int | None]
    rows: Sequence[Any]   # document rows, in index position order
    index: Index
    lengths: list[int]


# One inverted index per user, kept in this process and rebuilt only when the user's documents change.
MAX_CACHED_USERS = 100
_cache: OrderedDict[uuid.UUID, UserIndex] = OrderedDict()


def getUserIndex(db: Session, user_id: uuid.UUID) -> UserIndex:
    version = getDocumentsVersion(db, user_id)
    userIndex = _cache.get(user_id)
    if userIndex and userIndex.version == version:
        _cache.move_to_end(user_id)
        return userIndex

    rows = getUserDocuments(db, user_id)
    corpus = [row.text for row in rows]
    userIndex = UserIndex(version, rows, create_index(corpus), document_lengths(corpus))
    _cache[user_id] = userIndex
    _cache.move_to_end(user_id)
    if len(_cache) > MAX_CACHED_USERS:
        _cache.popitem(last=False)
    return userIndex
