from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
import enum

class VideoStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    DONE = "done"
    FAILED = "failed"

class Video(Base):
    __tablename__ = "videos"
    id: Mapped[int] = mapped_column(primary_key=True)
    path: Mapped[str]
    status: Mapped[VideoStatus] = mapped_column(default="pending")
    error: Mapped[str | None]
    started_at: Mapped[datetime | None]
    documents: Mapped[list["Document"]] = relationship(back_populates="video", cascade="all, delete-orphan")