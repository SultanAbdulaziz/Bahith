import uuid
from typing import Annotated, Literal
from pydantic import BaseModel, Field, StringConstraints

# remoed spaces at the start and end of every question, min_length=2 for example..."AI" "IR", max_length=500 is more reasonable and it will help sspeeding up the search #
Question = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=500)]

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=4000)

class ChatRequest(BaseModel):
    question: Question
    history: list[ChatMessage] = Field(default_factory=list, max_length=20)
    file_id: uuid.UUID | None=None
    k: int=Field(default=5, ge=1, le=10)

class Source(BaseModel):
    number: int
    file_id: uuid.UUID
    start: float
    end: float
    text: str
    score: float
    video_url: str

class ChatResponse(BaseModel):
    answer: str
    sources: list[Source] 