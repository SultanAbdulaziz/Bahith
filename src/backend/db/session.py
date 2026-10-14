import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(os.environ.get("DATABASE_URL"))
localSession = sessionmaker(engine)
def get_db():
    with localSession() as session:
        yield session