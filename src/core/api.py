"""HTTP API over core.search.

Run:  uvicorn core.api:app --app-dir src

Indexes live in memory and are lost on restart.
"""

from typing import Any, Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from .search import Index, bm25_search, boolean_search, create_index, document_lengths, tokenize

app = FastAPI(title="IR core")


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


indexes: dict[str, StoredIndex] = {}


def get(name: str) -> StoredIndex:
    if name not in indexes:
        raise HTTPException(404, f"index {name!r} not found")
    return indexes[name]


@app.post("/indexes", status_code=201)
def create(body: CreateIndexRequest) -> dict[str, Any]:
    stored = StoredIndex(body.documents)
    indexes[body.name] = stored
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
    get(name)
    del indexes[name]
