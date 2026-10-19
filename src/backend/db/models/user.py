from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid7)
    name: Mapped[str | None]
    email: Mapped[str | None] = mapped_column(unique=True)
    is_guest: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())