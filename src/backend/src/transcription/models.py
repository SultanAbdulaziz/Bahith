from pydantic import BaseModel
from typing import Literal

class Segment(BaseModel):
   id: int
   start: float
   end: float
   text: str

class Transcription(BaseModel):
   text: str
   duration: float
   segments: list[Segment]

class Window(BaseModel):
    start: float
    end: float
    text: str

class VideoTranscript(BaseModel):
    duration: float
    windows: list[Window]
