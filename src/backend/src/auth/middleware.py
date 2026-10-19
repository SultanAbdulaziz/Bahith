from fastapi import Request
from .service import verifyAccessToken, AuthError

def authorizeUser(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token:
        raise AuthError("UnAuthorized")
    return verifyAccessToken(token)
