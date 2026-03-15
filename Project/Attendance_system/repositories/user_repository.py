from sqlalchemy.orm import Session
from models.models import User
from schemas.schemas import UserCreate

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate, hashed_password: str):
    clean_email = user.email.lower()
    db_user = User(email=clean_email, hashed_password=hashed_password, role=user.role)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user