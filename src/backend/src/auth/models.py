import uuid
from pydantic import BaseModel, ConfigDict


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


class PublicUser(BaseModel):
    id: uuid.UUID
    email: str | None
    name: str | None
    is_guest: bool
    is_email_verified: bool
