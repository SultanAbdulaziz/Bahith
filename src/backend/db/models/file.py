import enum, uuid
from datetime import datetime
from sqlalchemy import DateTime, Enum, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class FileStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    DONE = "done"
    FAILED = "failed"

class File(Base):
    __tablename__ = "files"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid7)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    type: Mapped[str]
    storage_key: Mapped[str]
    status: Mapped[FileStatus] = mapped_column(Enum(FileStatus, native_enum=False), default=FileStatus.PENDING, index=True)
    error: Mapped[str | None]
    attempts: Mapped[int] = mapped_column(default=0)
    duration: Mapped[float | None]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    documents: Mapped[list["Document"]] = relationship(back_populates="file", cascade="all, delete-orphan") #Documents.file points here
