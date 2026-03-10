from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from schemas.schemas import StudentCreate, UserCreate
from repositories import student_repository, user_repository
from utils.jwt_handler import get_password_hash
from models.models import Student

def create_new_student(db: Session, student_data: StudentCreate):
    # 1. Check if the email is already used by another user
    if user_repository.get_user_by_email(db, student_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    # 2. Check if the student_id is already taken (Updated from roll_number)
    # Note: Use Student.roll_number here if you haven't renamed your DB column yet
    existing_student = db.query(Student).filter(Student.student_id == student_data.student_id).first()
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Student ID already exists"
        )

    # 3. Secure the password
    hashed_pwd = get_password_hash(student_data.password)
    
    # 4. Create the User login account first (force role to "student")
    user_data = UserCreate(
        email=student_data.email, 
        password=hashed_pwd, 
        role="student"
    )
    new_user = user_repository.create_user(db, user_data, hashed_pwd)

    # 5. Create the linked Student profile
    # Mapping the React fields to your repository function
    new_student = student_repository.create_student_profile(
        db=db, 
        user_id=new_user.id, 
        full_name=student_data.full_name, # Updated from name
        student_id=student_data.student_id, # Updated from roll_number
        grade=student_data.grade           # Added grade
    )
    new_student.email=student_data.email
    return new_student

def get_students_list(db: Session):
    return student_repository.get_all_students(db)