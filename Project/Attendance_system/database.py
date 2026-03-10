import os
import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from dotenv import load_dotenv
load_dotenv()
raw_password=os.getenv("DB_PASSWORD")

password = urllib.parse.quote_plus(raw_password)

SQLALCHEMY_DATABASE_URL = f"postgresql://postgres:{password}@localhost:5432/smart_attendance_db"

engine=create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base=declarative_base()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()