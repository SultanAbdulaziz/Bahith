from sqlalchemy import func, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
import uuid
from datetime import datetime

class UserSession(Base):
    __tablename__ = "user_sessions"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid7)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())