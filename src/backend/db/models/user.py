from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid7)
    name: Mapped[str | None]
    email: Mapped[str | None] = mapped_column(unique=True)
    is_email_verified: Mapped[bool] = mapped_column(default=False)
    password_hash: Mapped[str | None]
    google_sub: Mapped[str | None] = mapped_column(unique=True)
    is_guest: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())