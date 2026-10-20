import time
from datetime import datetime, timedelta, UTC
from sqlalchemy import select, update, or_, and_
from db.session import localSession
from db.models import File
from db.models.file import FileStatus
from .job import job
from sqlalchemy.orm import Session

MAX_ATTEMPTS = 3
POLL_SECONDS = 3
STUCK_AFTER = timedelta(hours=1)

def claim_next(db: Session) -> File:
    row = db.execute(
        select(File)
        .where(or_(
            File.status == FileStatus.PENDING,
            and_(File.status == FileStatus.FAILED, File.attempts < MAX_ATTEMPTS),
            and_(File.status == FileStatus.PROCESSING, File.started_at < datetime.now(UTC) - STUCK_AFTER),
        )).order_by(File.created_at).limit(1).with_for_update(skip_locked=True)
    ).first()
    file: File | None = row[0] if row else None

    if file:
        file.status = FileStatus.PROCESSING
        file.started_at = datetime.now(UTC)
        db.commit()
    return file

def run():
    while True:
        with localSession() as db:
            file: File = claim_next(db)
            if file is None:
                time.sleep(POLL_SECONDS)
                continue
            try:
                job(db, file)
            except Exception as e:
                db.rollback()
                file.status = FileStatus.FAILED
                file.error = str(e)
                file.attempts += 1
                db.commit()

if __name__ == "__main__":
    run()