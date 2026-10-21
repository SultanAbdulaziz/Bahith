import logging
import groq
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from src.auth.middleware import authorizeUser
from . import service as chatService
from .models import ChatRequest, ChatResponse

logger = logging.getLogger(__name__)

chatRouter = APIRouter(prefix="/chat")


@chatRouter.post("", response_model=ChatResponse)
def chat(body: ChatRequest, user_id = Depends(authorizeUser), db: Session = Depends(get_db)):
    try:
        return chatService.answer(db, user_id, body)
    except groq.RateLimitError:
        raise HTTPException(429, "too many questions right now, please wait a moment and try again")
    except groq.APIError as error:
        logger.error("groq chat request failed: %s", error)
        raise HTTPException(502, "the AI service is not responding, please try again")