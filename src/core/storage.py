"""Database storage for the documents of each index.

The database comes from CORE_DATABASE_URL (default: sqlite:///core.db).
Only documents are stored; indexes are rebuilt from them. The API runs as a
single worker, so its in-memory cache is the only reader and writer.
"""

import os
from typing import Any

from sqlalchemy import (
    JSON,
    Column,
    Integer,
    MetaData,
    String,
    Table,
    Text,
    UniqueConstraint,
    create_engine,
    delete,
    insert,
    select,
)

engine = create_engine(os.environ.get("CORE_DATABASE_URL", "sqlite:///core.db"))
metadata = MetaData()

documents_table = Table(
    "core_documents",
    metadata,
    Column("index_name", String, primary_key=True),
    Column("position", Integer, primary_key=True),
    Column("doc_id", String, nullable=False),
    Column("text", Text, nullable=False),
    Column("metadata", JSON, nullable=False),
    UniqueConstraint("index_name", "doc_id"),
)


def init() -> None:
    """Create the table if it does not exist."""
    metadata.create_all(engine)


def save(name: str, documents: list[dict[str, Any]]) -> None:
    with engine.begin() as connection:
        connection.execute(delete(documents_table).where(documents_table.c.index_name == name))
        connection.execute(
            insert(documents_table),
            [
                {
                    "index_name": name,
                    "position": position,
                    "doc_id": document["id"],
                    "text": document["text"],
                    "metadata": document["metadata"],
                }
                for position, document in enumerate(documents)
            ],
        )


def load(name: str) -> list[dict[str, Any]] | None:
    with engine.connect() as connection:
        rows = connection.execute(
            select(documents_table.c.doc_id, documents_table.c.text, documents_table.c.metadata)
            .where(documents_table.c.index_name == name)
            .order_by(documents_table.c.position)
        ).all()
    if not rows:
        return None
    return [{"id": doc_id, "text": text, "metadata": meta} for doc_id, text, meta in rows]


def remove(name: str) -> bool:
    with engine.begin() as connection:
        deleted = connection.execute(
            delete(documents_table).where(documents_table.c.index_name == name)
        )
    return bool(deleted.rowcount)
