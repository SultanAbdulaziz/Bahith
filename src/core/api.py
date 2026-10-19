"""HTTP API over core.search.

Run:  uvicorn core.api:app --app-dir src

Documents are stored in the database from CORE_DATABASE_URL (see storage.py).
Indexes are built from them on first use and kept in memory. Run one worker
only: the cache is not shared, so other workers would serve stale indexes.
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any, Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from . import storage
from .search import Index, bm25_search, boolean_search, create_index, document_lengths, tokenize


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    storage.init()
    yield


app = FastAPI(title="IR core", lifespan=lifespan)


class Document(BaseModel):
    id: str
    text: str
    metadata: dict[str, Any] = {}


class CreateIndexRequest(BaseModel):
    name: str
    documents: list[Document] = Field(min_length=1)


class SearchRequest(BaseModel):
    query: str
    mode: Literal["boolean", "bm25"] = "boolean"
    k: int = Field(default=10, ge=1, le=100)


class StoredIndex:
    def __init__(self, documents: list[Document]) -> None:
        corpus = [document.text for document in documents]
        self.documents = documents
        self.index: Index = create_index(corpus)
        self.lengths = document_lengths(corpus)


cache: dict[str, StoredIndex] = {}

def get(name: str) -> StoredIndex:
    cached = cache.get(name)
    if cached is not None:
        return cached
    documents = storage.load(name)
    if documents is None:
        raise HTTPException(404, f"index {name!r} not found")
    stored = StoredIndex([Document(**document) for document in documents])
    cache[name] = stored
    return stored


@app.post("/indexes", status_code=201)
def create(body: CreateIndexRequest) -> dict[str, Any]:
    ids = [document.id for document in body.documents]
    if len(set(ids)) != len(ids):
        raise HTTPException(422, "document ids must be unique")
    storage.save(body.name, [document.model_dump() for document in body.documents])
    stored = StoredIndex(body.documents)
    cache[body.name] = stored
    return {"name": body.name, "documents": len(stored.documents), "terms": len(stored.index)}


@app.get("/indexes/{name}/postings")
def postings(name: str, term: str) -> dict[str, Any]:
    stored = get(name)
    tokens = tokenize(term)
    token = tokens[0] if tokens else ""
    found = stored.index.get(token, {})
    return {
        "term": token,
        "postings": [{"doc_id": stored.documents[doc].id, "tf": tf} for doc, tf in found.items()],
    }


@app.post("/indexes/{name}/search")
def search(name: str, body: SearchRequest) -> dict[str, Any]:
    stored = get(name)
    if body.mode == "boolean":
        matches = boolean_search(body.query, stored.index)
        total = len(matches)
        hits: list[tuple[int, float | None]] = [(doc, None) for doc in matches[: body.k]]
    else:
        hits = list(bm25_search(body.query, stored.index, stored.lengths, body.k))
        total = len(hits)
    return {
        "query": body.query,
        "mode": body.mode,
        "total": total,
        "results": [
            {
                "doc_id": stored.documents[doc].id,
                "score": score,
                "text": stored.documents[doc].text,
                "metadata": stored.documents[doc].metadata,
            }
            for doc, score in hits
        ],
    }


@app.delete("/indexes/{name}", status_code=204)
def delete(name: str) -> None:
    cache.pop(name, None)
    if not storage.remove(name):
        raise HTTPException(404, f"index {name!r} not found")
