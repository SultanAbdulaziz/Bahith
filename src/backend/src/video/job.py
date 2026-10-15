from src.transcription import service as transcriptionService
from src.storage import service as storageService
from src.transcription.models import VideoTranscript
from sqlalchemy.orm import Session
from db.models import Video, Document
from db.models.videos import VideoStatus

def job(db: Session, video: Video):
    url = storageService.download_url(video.storage_key)
    transcript: VideoTranscript = transcriptionService.transcribe_video(url)
    for window in transcript.windows:
        db.add(Document(video_id=video.id, **window.model_dump()))
    video.status = VideoStatus.DONE
    video.duration = transcript.duration
    db.commit()

