from sqlalchemy.orm import Session
from db.models import Document, InvertedIndex
from .tokenizer import tokenize

def index(db: Session, document: Document):
    tokens = tokenize(document.text)
    document.length = len(tokens)
    db.flush()
    term_frequency: dict[str, int] = dict.fromkeys(tokens, 0)
    for term in tokens:
        term_frequency[term] = term_frequency[term] + 1
    for term, count in term_frequency.items():
        db.add(InvertedIndex(term = term, document_id = document.id, tf = count))