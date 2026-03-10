from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from schemas.schemas import UserCreate, UserLogin
from repositories import user_repository
from utils.jwt_handler import get_password_hash, verify_password, create_access_token

def register_user(db: Session, user_data: UserCreate):
    # 1. Check if the email is already in the database
    existing_user = user_repository.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. Hash the password
    hashed_password = get_password_hash(user_data.password)
    
    # 3. Save the user
    return user_repository.create_user(db, user_data, hashed_password)

def authenticate_user(db: Session, login_data: UserLogin):
    # 1. Find the user
    user = user_repository.get_user_by_email(db, login_data.email)
    
    # 2. Check if user exists AND password is correct
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )
    
    # 3. Generate the JWT token with their specific role
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    return {"access_token": access_token, "token_type": "bearer"}