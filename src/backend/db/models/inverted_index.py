from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class InvertedIndex(Base):
    __tablename__ = "inverted_index"
    term: Mapped[str] = mapped_column(primary_key=True)
    document_id: Mapped[int] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), primary_key=True, index=True)
    tf: Mapped[int]