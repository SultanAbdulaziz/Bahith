# IR core

A small, domain-agnostic search engine: an inverted index, Boolean search and
BM25 ranking over a list of text documents. The IR code in `search.py` uses
only the Python standard library. `api.py` exposes it over HTTP with FastAPI.

## Use from Python

```python
from core.search import create_index, boolean_search, bm25_search, document_lengths

corpus = ["samsung galaxy tv", "sony tv", "sony headphones", "apple ipad"]
index = create_index(corpus)
# {"samsung": {0: 1}, "galaxy": {0: 1}, "tv": {0: 1, 1: 1}, "sony": {1: 1, 2: 1}, ...}

boolean_search("samsung sony&tv", index)      # samsung OR (sony AND tv) -> [0, 1]
boolean_search("samsung&sony tv", index)      # (samsung AND sony) OR tv -> [0, 1]

bm25_search("sony tv", index, document_lengths(corpus), k=3)   # [(1, 1.45), (2, 0.73), (0, 0.61)]
```

- A document's id is its position in the corpus list.
- `create_index` lowercases and splits text into `\w+` tokens. It keeps how
  often each term occurs in each document, which BM25 needs.
- In `boolean_search`, a space means OR and `&` means AND. AND binds tighter.
  The result is a sorted list of document ids.
- `bm25_search` uses k1 = 1.2, b = 0.75 and
  idf = ln((N - df + 0.5) / (df + 0.5) + 1). A term repeated in the query counts once.

## Experiments

`corpus.json` is a JSON list of strings. Each query is searched with
`boolean_search`. The output gives the number of results and the time in
microseconds:

```bash
cd src
python -m core.search corpus.json "samsung sony&tv" "apple&ipad" "election"
```

## Local Run

From the repository root:

```bash
uv venv && source .venv/bin/activate
uv pip install -r src/core/requirements.txt
uvicorn core.api:app --app-dir src --reload
```

Interactive API docs: <http://127.0.0.1:8000/docs>.

Documents are `{id, text, metadata}`. `metadata` is returned untouched.
Indexes are kept in memory and are lost on restart.

```bash
curl -X POST localhost:8000/indexes -H 'Content-Type: application/json' -d '{
  "name": "demo",
  "documents": [
    {"id": "a", "text": "samsung galaxy tv"},
    {"id": "b", "text": "sony tv", "metadata": {"page": 2}}
  ]
}'

curl 'localhost:8000/indexes/demo/postings?term=tv'

curl -X POST localhost:8000/indexes/demo/search -H 'Content-Type: application/json' \
  -d '{"query": "samsung sony&tv", "mode": "boolean"}'

curl -X POST localhost:8000/indexes/demo/search -H 'Content-Type: application/json' \
  -d '{"query": "sony tv", "mode": "bm25", "k": 5}'

curl -X DELETE localhost:8000/indexes/demo
```
