import time
from datetime import datetime, timedelta, UTC
from sqlalchemy import select, update, or_, and_
from db.session import localSession
from db.models import Video
from db.models.video import VideoStatus
from .job import job
from sqlalchemy.orm import Session

MAX_ATTEMPTS = 3
POLL_SECONDS = 3
STUCK_AFTER = timedelta(hours=1)

def claim_next(db: Session) -> Video:
    row = db.execute(
        select(Video)
        .where(or_(
            Video.status == VideoStatus.PENDING,
            and_(Video.status == VideoStatus.FAILED, Video.attempts < MAX_ATTEMPTS),
            and_(Video.status == VideoStatus.PROCESSING, Video.started_at < datetime.now(UTC) - STUCK_AFTER),
        )).order_by(Video.created_at).limit(1).with_for_update(skip_locked=True)
    ).first()
    video: Video | None = row[0] if row else None

    if video:
        video.status = VideoStatus.PROCESSING
        video.started_at = datetime.now(UTC)
        db.commit()
    return video

def run():
    while True:
        with localSession() as db:
            video: Video = claim_next(db)
            if video is None:
                time.sleep(POLL_SECONDS)
                continue
            try:
                job(db, video)
            except Exception as e:
                db.rollback()
                video.status = VideoStatus.FAILED
                video.error = str(e)
                video.attempts += 1
                db.commit()

if __name__ == "__main__":
    run()