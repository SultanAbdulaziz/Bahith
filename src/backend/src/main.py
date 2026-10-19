from fastapi import APIRouter, FastAPI

app = FastAPI(title="videoIR")

api_router = APIRouter(prefix="/api")


@api_router.get("/health")
def health():
    return {"status": "ok"}


app.include_router(api_router)
