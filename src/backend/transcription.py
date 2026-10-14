import os
from groq import Groq

client = Groq()
filename = os.path.dirname(__file__) + "/sample_audio.m4a"

def transcribe():
  with open(filename, "rb") as file:
      transcription = client.audio.transcriptions.create(
        file=(filename, file.read()),
        model="whisper-large-v3",
        response_format="verbose_json",  # Optional
        temperature=0.0
      )
      print(transcription.text)
