from src.transcription import service as transcriptionService
from src.storage import service as storageService
from src.transcription.models import VideoTranscript
from sqlalchemy.orm import Session
from db.models import File, Document
from db.models.file import FileStatus

def job(db: Session, file: File):
    url = storageService.download_url(file.storage_key)
    transcript: VideoTranscript = transcriptionService.transcribe_video(url)
    for window in transcript.windows:
        document = Document(
            file_id=file.id,
            text=window.text, 
            meta={
                "start": window.start,
                "end": window.end
            }
        )
        db.add(document)
    file.status = FileStatus.DONE
    file.duration = transcript.duration
    db.commit()

