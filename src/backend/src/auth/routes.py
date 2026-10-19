from fastapi import APIRouter

authRouter = APIRouter("/auth")

@authRouter.post(prefix="/register")
def register():
    pass

@authRouter.post(prefix="/login")
def login():
    pass

@authRouter.post(prefix="/me")
def me():
    pass

@authRouter.post(prefix="/forgot-password")
def forgot_password():
    pass