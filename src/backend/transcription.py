import os
from groq import Groq
from pydantic import BaseModel
from typing import Literal
import subprocess

class Segment(BaseModel):
   id: int
   start: float
   end: float
   text: str

class Transcription(BaseModel):
   text: str
   language: Literal["English", "Arabic"]
   duration: float
   segments: list[Segment]

class Window(BaseModel):
    start: float
    end: float
    text: str

CHUNK_SECONDS = 600
OVERLAP_SECONDS = 10
WINDOW_SECONDS = 15.0
API_KEY = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=API_KEY)


def transcribe(data: bytes, filename: str, offset: float) -> list[Segment]:
  transcription = client.audio.transcriptions.create(
    file=(filename, data),
    model="whisper-large-v3",
    response_format="verbose_json",  # Optional
    timestamp_granularities=["segment"],
    temperature=0.0
    )
  result = Transcription.model_validate(transcription.model_dump())
  return [{"start": segment.start + offset, "end": segment.end + offset, "text": segment.text} for segment in result.segments if segment.text.strip()]

def extract_audio(path: str, start: float, length: float) -> bytes:
    return subprocess.run(
        ["ffmpeg"]
    )

def transcribe_chunk(path: str, offset: float) -> list[Segment]:
    pass

def build_windows(segments: list[Segment]) -> list[Window]:
   pass
      
