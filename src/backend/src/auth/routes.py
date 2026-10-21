from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from db.session import get_db
from . import models
from . import service as authService
from . import middleware

authRouter = APIRouter(prefix="/auth")


def setAuthCookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        "access_token",
        access_token, 
        httponly=True, 
        secure=True, 
        samesite="lax", 
        path="/",
        max_age=authService.ACCESS_TOKEN_MINUTES * 60
    )
    response.set_cookie(
        "refresh_token", 
        refresh_token, 
        httponly=True, 
        secure=True, 
        samesite="lax", 
        path="/api/auth",
        max_age=authService.REFRESH_TOKEN_DAYS * 24 * 60 * 60
    )


@authRouter.post("/register", status_code=204)
def register(body: models.RegisterRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    try:
        guest_id = middleware.authorizeUser(request)
    except authService.AuthError:
        guest_id = None
    access_token, refresh_token = authService.register(db, body.email, body.password, body.name, guest_id)
    setAuthCookies(response, access_token, refresh_token)

@authRouter.post("/login")
def login(body: models.LoginRequest, response: Response, db: Session = Depends(get_db)):
    access_token, refresh_token = authService.login(db, body.email, body.password)
    setAuthCookies(response, access_token, refresh_token)

@authRouter.get("/me")
def me(user_id = Depends(middleware.authorizeUser), db: Session = Depends(get_db)):
    user = authService.getUser(db, user_id)
    return models.PublicUser(id=user.id, email=user.email, name=user.name, is_guest=user.is_guest, is_email_verified=user.is_email_verified)

@authRouter.post("/refresh")
def refresh(request: Request, response: Response, db = Depends(get_db)):
    token = request.cookies.get("refresh_token")
    access_token, refresh_token = authService.refreshToken(db, token)
    setAuthCookies(response, access_token, refresh_token)

@authRouter.post("/logout", status_code=204)
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get("refresh_token")
    if token:
        authService.logout(db, token)
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/api/auth")

@authRouter.post("/guest", status_code=204)
def guest(response: Response, db: Session = Depends(get_db)):
    access_token, refresh_token = authService.createGuest(db)
    setAuthCookies(response, access_token, refresh_token)

#todo later
"""
@authRouter.post("/forgot-password")
def forgot_password():
    pass

@authRouter.post("/reset-password")
def reset_password():
    pass

@authRouter.get("/google/login")
def google_login():
    pass

@authRouter.get("/google/callback")
def google_callback():
    pass
"""