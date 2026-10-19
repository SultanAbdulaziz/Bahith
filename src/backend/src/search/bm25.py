import uuid
import math
import heapq
from sqlalchemy.orm import Session
from .corpus import getTermFrequency, getNumberOfDocuments
from .tokenizer import tokenize

k = 1.2   
b = 0.75 
MAX_RESULTS = 25


def BM25(db: Session, query: str, user_id: uuid.UUID) -> list[tuple[float, int]]:
    Q = tokenize(query)                                  # query_terms
    postings = getTermFrequency(db, user_id, Q)
    if not postings:
        return []

    N, avdl = getNumberOfDocuments(db, user_id)          # total_documents, average_length
    avdl = float(avdl)

    tf: dict[int, dict[str, int]] = {}                   # term_counts_by_document: D → {q: tf_q,D}
    dl: dict[int, int] = {}                              # document_lengths: D → dl
    df: dict[str, int] = {}                              # documents_containing_term: q → df_q
    for (posting, length) in postings:
        tf.setdefault(posting.document_id, {})[posting.term] = posting.tf
        dl[posting.document_id] = length
        df[posting.term] = df.get(posting.term, 0) + 1

    scores = []                                          # results
    for D in tf:                                         # document_id
        score = 0.0
        for q in Q:                                      # term
            tf_qD = tf[D].get(q, 0)                      # term_frequency
            df_q = df.get(q, 0)                          # document_frequency
            idf = math.log((N - df_q + 0.5) / (df_q + 0.5) + 1)   # +1 keeps idf positive
            score += idf * (tf_qD * (k + 1)) / (tf_qD + k * (1 - b + b * dl[D] / avdl))
        scores.append((score, D))

    return heapq.nlargest(MAX_RESULTS, scores)
