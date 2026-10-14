import os
from groq import Groq
import subprocess
from .models import Transcription, Segment, Window, VideoTranscript

CHUNK_SECONDS = 600
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
  return [
    segment.model_copy(update={"start": segment.start + offset, "end": segment.end + offset})
    for segment in result.segments
    if segment.text.strip()
]

def extract_audio(path: str, start: float) -> bytes:
    command = [
        "ffmpeg",
        "-v", "error",          # only print errors
        "-ss", str(start),      # start time (seconds)
        "-t", str(CHUNK_SECONDS),# duration (seconds)
        "-i", path,             # input file
        "-vn",                  # drop video
        "-ac", "1",             # mono
        "-ar", "16000",         # 16 kHz sample rate
        "-c:a", "libopus",      # Opus codec
        "-b:a", "32k",          # 32 kbps bitrate
        "-f", "ogg",            # Ogg container
        "pipe:1",               # write to stdout
    ]

    result = subprocess.run(command, capture_output=True)

    if result.returncode != 0:
        error = result.stderr.decode().strip()
        raise RuntimeError(f"ffmpeg failed: {error}")

    return result.stdout

def get_duration(path: str) -> float:
    result = subprocess.run(
        [
          "ffprobe",
          "-v",
          "error",
          "-show_entries",
          "format=duration",
          "-of", 
          "csv=p=0",
          path
        ],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"ffprobe failed: {result.stderr.strip()}")
    return float(result.stdout)

def transcribe_chunk(path: str, offset: float) -> list[Segment]:
  chunk_audio = extract_audio(path, offset) 
  chunk_segments = transcribe(chunk_audio, "chunk.ogg", offset)
  return chunk_segments

def build_windows(segments: list[Segment]) -> list[Window]:
    buckets: dict[int, list[str]] = {}

    for segment in segments:
        index = int(segment.start // WINDOW_SECONDS)
        buckets.setdefault(index, []).append(segment.text.strip())

    return [
        Window(
            start=index * WINDOW_SECONDS,
            end=(index + 1) * WINDOW_SECONDS,
            text=" ".join(buckets[index]),
        )
        for index in sorted(buckets)
    ]

def transcribe_video(path: str) -> VideoTranscript:
  duration = get_duration(path)
  segments = []
  offset = 0
  while offset < duration:
      segments.extend(transcribe_chunk(path, offset))
      offset += CHUNK_SECONDS
  return VideoTranscript(duration=duration, windows=build_windows(segments))
     
      