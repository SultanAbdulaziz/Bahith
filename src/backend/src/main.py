from fastapi import APIRouter, FastAPI
from fastapi.responses import JSONResponse
from src.auth.service import AuthError
from src.auth.routes import authRouter

app = FastAPI(title="videoIR")

#Main Router (api_router) .include_router() to mount service routers ~Sultan
api_router = APIRouter(prefix="/api")
api_router.include_router(authRouter)

@api_router.get("/health")
def health():
    return {"status": "ok"}

app.include_router(api_router)



@app.exception_handler(AuthError)
def auth_error(request, error):
    return JSONResponse(status_code=401, content={"detail": str(error)})