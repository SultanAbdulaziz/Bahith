from src.transcription import service as transcriptionService
from src.storage import service as storageService
from src.transcription.models import VideoTranscript
from sqlalchemy.orm import Session
from db.models import Video, Document
from db.models.video import VideoStatus
from src.search.indexer import index

def job(db: Session, video: Video):
    url = storageService.download_url(video.storage_key)
    transcript: VideoTranscript = transcriptionService.transcribe_video(url)
    for window in transcript.windows:
        document = Document(video_id=video.id, **window.model_dump())
        db.add(document)
        index(db, document)
    video.status = VideoStatus.DONE
    video.duration = transcript.duration
    db.commit()

