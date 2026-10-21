"""Inverted index, Boolean search and BM25 ranking over a list of strings.

A corpus is a list of documents (strings). A document's id is its position in
that list. Only the Python standard library is used.

Experiments (part c), from src/backend:  python -m src.search.engine corpus.json "query one" "query two" ...
"""

import json
import math
import re
import sys
import time

Index = dict[str, dict[int, int]]  # term -> {doc_id: term frequency}

_TOKEN = re.compile(r"\w+")


def tokenize(text: str) -> list[str]:
    """Lowercase the text and split it into word tokens."""
    return _TOKEN.findall(text.lower())


def create_index(corpus: list[str]) -> Index:
    """Map every term to the documents it occurs in, with how often it occurs there."""
    index: Index = {}
    for doc_id, document in enumerate(corpus):
        for term in tokenize(document):
            postings = index.setdefault(term, {})
            postings[doc_id] = postings.get(doc_id, 0) + 1
    return index


def boolean_search(query: str, index: Index) -> list[int]:
    """Return the ids of documents matching the query, sorted.

    A space means OR and "&" means AND, and AND binds tighter:
    "samsung sony&tv" is samsung OR (sony AND tv).
    """
    results: set[int] = set()
    for clause in query.split():
        terms = [token for part in clause.split("&") for token in tokenize(part)]
        if not terms:
            continue
        # Intersect from the shortest posting list, so the working set only shrinks.
        postings = sorted((set(index.get(term, {})) for term in terms), key=len)
        results |= set.intersection(*postings)
    return sorted(results)


K1 = 1.2
B = 0.75


def bm25_search(query: str, index: Index, doc_lengths: list[int], k: int | None = 10) -> list[tuple[int, float]]:
    """Rank documents by BM25 and return the top k (doc_id, score) pairs, best first.

    doc_lengths holds the number of tokens of each document, in corpus order.
    A term repeated in the query counts once.
    """
    n = len(doc_lengths)
    avgdl = sum(doc_lengths) / n if n else 0.0
    scores: dict[int, float] = {}
    for term in set(tokenize(query)):
        postings = index.get(term, {})
        df = len(postings)
        idf = math.log((n - df + 0.5) / (df + 0.5) + 1)
        for doc_id, tf in postings.items():
            norm = K1 * (1 - B + B * doc_lengths[doc_id] / avgdl)
            scores[doc_id] = scores.get(doc_id, 0.0) + idf * tf * (K1 + 1) / (tf + norm)
    ranked = sorted(scores.items(), key=lambda item: (-item[1], item[0]))
    return ranked if k is None else ranked[:k]


def document_lengths(corpus: list[str]) -> list[int]:
    """Number of tokens in each document, for BM25."""
    return [len(tokenize(document)) for document in corpus]


def run_experiments(corpus: list[str], queries: list[str]) -> None:
    """Index the corpus, run each Boolean query, print result counts and time in microseconds."""
    start = time.time()
    index = create_index(corpus)
    end = time.time()
    print(f"indexed {len(corpus)} documents, {len(index)} terms, in {(end - start) * 10**6:.0f} µs\n")

    print(f"{'query':40} {'results':>8} {'time (µs)':>10}")
    for query in queries:
        start = time.time()
        results = boolean_search(query, index)
        end = time.time()
        print(f"{query:40} {len(results):>8} {(end - start) * 10**6:>10.1f}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit('usage: python -m src.search.engine corpus.json "query" ["query" ...]   (corpus: JSON list of strings)')
    with open(sys.argv[1], encoding="utf-8") as f:
        run_experiments(json.load(f), sys.argv[2:])
