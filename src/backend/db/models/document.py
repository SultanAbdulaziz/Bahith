from base import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey

class Document(Base):
    __tablename__ = "documents"
    id: Mapped[int] = mapped_column(primary_key=True)
    video_id: Mapped[int] = mapped_column(ForeignKey("videos.id", ondelete="CASCADE"), index=True)
    start: Mapped[float]      #jump time in video plated
    end: Mapped[float]
    text: Mapped[str]         #BM25 index
