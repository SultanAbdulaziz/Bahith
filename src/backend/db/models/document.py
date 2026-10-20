import uuid
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class Document(Base):
    __tablename__ = "documents"
    id: Mapped[int] = mapped_column(primary_key=True)
    file_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("files.id", ondelete="CASCADE"), index=True)
    text: Mapped[str]
    meta: Mapped[dict] = mapped_column("metadata", JSON)
    file: Mapped["File"] = relationship(back_populates="documents")   #File.documents points here
