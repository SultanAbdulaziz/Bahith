import bcrypt
from sqlalchemy import insert, select, update, delete
from sqlalchemy.orm import Session
from db.models import User, UserSession
from datetime import datetime, UTC, timedelta
import jwt
import os
import uuid

MIN_PASSWORD_LENGTH = 8
ACCESS_TOKEN_MINUTES = 15
REFRESH_TOKEN_DAYS = 14
JWT_SECRET = os.environ["JWT_SECRET"]

class AuthError(Exception):
    pass


def signAccessToken(user_id: str):
    payload = {"sub": user_id, "iat": datetime.now(UTC), "type": "access", "exp": datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_MINUTES)}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def signRefreshToken(user_id: str, session_id: str, expires_at: datetime):
    payload = {"sub": user_id, "sid": session_id, "iat": datetime.now(UTC), "type": "refresh", "exp": expires_at}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def RefreshExpiry() -> datetime:
    #so db table and jwt have the exact timestamp
    return (datetime.now(UTC) + timedelta(days=REFRESH_TOKEN_DAYS)).replace(microsecond=0)

def createSession(db: Session, user_id: uuid.UUID) -> str:
    expires_at = RefreshExpiry()
    (session_id,) = db.execute(
        insert(UserSession)
        .values(user_id=user_id, expires_at=expires_at)
        .returning(UserSession.id)
    ).one()
    db.commit()
    return signRefreshToken(str(user_id), str(session_id), expires_at)

def register(db: Session, email: str, password: str, name: str | None = None) -> tuple[str, str]:
    email = email.strip().lower()
    if len(password) < MIN_PASSWORD_LENGTH:
        raise AuthError(f"password must be at least {MIN_PASSWORD_LENGTH} characters")
    if len(password.encode()) > 72:
        raise AuthError("password too long")
    if db.execute(select(User.id).where(User.email == email)).first():
        raise AuthError("email already registered")

    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    (user,) = db.execute(
        insert(User)
        .values(email=email, name=name, password_hash=password_hash, is_guest=False)
        .returning(User)
    ).one()
    db.commit()
    access_token = signAccessToken(str(user.id))
    refresh_token = createSession(db, user.id)
    return access_token, refresh_token

def login(db: Session, email: str, password_attempt: str) -> tuple[str, str]:
    email = email.strip().lower()
    row = db.execute(
        select(User.password_hash, User.id)
        .where(User.email == email)
    ).first()
    if not row or row[0] is None:
        raise AuthError("incorrect email or password")
    password_hash=row[0]
    if not bcrypt.checkpw(password_attempt.encode(), password_hash.encode()):
        raise AuthError("incorrect email or password") # so attacker doesnt know if the email is registered or not
    user_id = row[1]
    access_token = signAccessToken(str(user_id))
    refresh_token = createSession(db, user_id)
    return access_token, refresh_token

def refreshToken(db: Session, refresh_token: str) -> tuple[str, str]:
    try:
        payload = jwt.decode(refresh_token, JWT_SECRET, algorithms="HS256")
    except jwt.InvalidTokenError:
        raise AuthError("invalid refresh token")
    if payload.get("type") != "refresh":
        raise AuthError("invalid refresh token")

    session_id = uuid.UUID(payload["sid"])
    row = db.execute(
        select(UserSession.expires_at)
        .where(UserSession.id == session_id)
        .with_for_update()
    ).first()
    if not row:
        raise AuthError("invalid refresh token")
    if int(row[0].timestamp()) != payload["exp"]:
        db.execute(delete(UserSession).where(UserSession.id == session_id))  # reuse detected
        db.commit()
        raise AuthError("invalid refresh token")

    expires_at = RefreshExpiry()
    db.execute(
        update(UserSession)
        .where(UserSession.id == session_id)
        .values(expires_at=expires_at)
    )
    db.commit()
    return signAccessToken(payload["sub"]), signRefreshToken(payload["sub"], str(session_id), expires_at)
    
def verifyAccessToken(access_token: str):
    try:
        payload = jwt.decode(access_token, JWT_SECRET, algorithms="HS256")
    except jwt.InvalidTokenError:
        raise AuthError("invalid access token")
    if not payload["type"] == "access":
        raise AuthError("invalid access token")
    return uuid.UUID(payload["sub"])

def createGuest(db: Session) -> tuple[str, str]:
    (user_id,) = db.execute(insert(User).values(is_guest=True).returning(User.id)).one()
    db.commit()
    return signAccessToken(str(user_id)), createSession(db, user_id)

def logout(db: Session, refresh_token: str) -> None:
    try:
        payload = jwt.decode(refresh_token, JWT_SECRET, algorithms="HS256")
    except jwt.InvalidTokenError:
        return
    if payload.get("type") != "refresh":
        return
    db.execute(delete(UserSession).where(UserSession.id == uuid.UUID(payload["sid"])))
    db.commit()

def getUser(db: Session, user_id: uuid.UUID) -> User:
    row = db.execute(select(User).where(User.id == user_id)).first()
    if not row:
        raise AuthError("user not found")
    return row[0]