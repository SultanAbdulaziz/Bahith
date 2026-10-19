import enum, uuid
from datetime import datetime
from sqlalchemy import Enum, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class VideoStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    DONE = "done"
    FAILED = "failed"

class Video(Base):
    __tablename__ = "videos"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid7)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    storage_key: Mapped[str]
    status: Mapped[VideoStatus] = mapped_column(Enum(VideoStatus, native_enum=False), default=VideoStatus.PENDING, index=True)
    error: Mapped[str | None]
    attempts: Mapped[int] = mapped_column(default=0)
    duration: Mapped[float | None]
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    started_at: Mapped[datetime | None]
    documents: Mapped[list["Document"]] = relationship(back_populates="video", cascade="all, delete-orphan") #Documents.video points here