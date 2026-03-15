from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.schemas import UserCreate, UserResponse,LoginRequest
from services import auth_service
from models.models import User
from utils.jwt_handler import verify_password,create_access_token
from utils.dependencies import get_current_user

# Create the router
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Registers a new user (Admin, Teacher, or Student)"""
    return auth_service.register_user(db, user)

@router.post("/login")
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    # 1. Find the user by the email provided in the JSON
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    
    # 2. Verify the password (assuming you have a verify_password function from bcrypt)
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=401, 
            detail="Invalid email or password"
        )
        
    # 3. Create the JWT token
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    # 4. Return the exact JSON structure the React frontend is demanding
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.email, # The frontend expects a 'username' field
            "email": user.email,
            "role": user.role,
            "full_name": user.email.split("@")[0].capitalize() # Quick fallback name!
        }
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Takes the token payload, finds the actual user in the DB, 
    and returns the full profile (id, email, role).
    """
    # The token stores the email inside the "sub" key
    user_email = current_user.get("sub")
    
    # Fetch the real user from the database
    db_user = db.query(User).filter(User.email == user_email).first()
    
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    return db_user