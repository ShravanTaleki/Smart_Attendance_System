from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from schemas.schemas import StudentCreate, UserCreate,StudentUpdate
from repositories import student_repository, user_repository
from utils.jwt_handler import get_password_hash
from models.models import Student,User

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


def update_student(db: Session, student_id: int, student_update: StudentUpdate):
    # 1. Find the Student by the ID from the frontend (e.g., id: 4)
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")

    # 2. Find their actual User account (e.g., user_id: 5)
    db_user = db.query(User).filter(User.id == db_student.user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User account not found")

    # 3. Apply the updates to the correct tables
    update_data = student_update.dict(exclude_unset=True)
    
    print("INCOMING UPDATE DATA:", update_data)
    
    for key, value in update_data.items():
        # Route User table fields
        if key in ["email", "role"]: 
            if key == "email":
                value = value.lower() # Keep our case-insensitive fix!
            setattr(db_user, key, value)
            
        # Route Student table fields (full_name, grade, student_id, etc.)
        else: 
            setattr(db_student, key, value)

    # 4. Save everything
    db.commit()
    db.refresh(db_student)
    
    # Return the updated student (FastAPI will combine it based on your StudentResponse schema)
    # ... (previous code where you did db.commit() and db.refresh(db_student)) ...

    # 5. Package the data from BOTH tables into a single dictionary 
    # so it perfectly matches your StudentResponse schema!
    return {
        "id": db_student.id,
        "user_id": db_user.id,
        "full_name": db_student.full_name,
        "student_id": db_student.student_id,
        "grade": db_student.grade,
        "email": db_user.email  # We grab the email from the User table!
    }


def delete_student(db: Session, student_id: int):
    # 1. First, find the STUDENT by the ID passed from the frontend (e.g., id: 4)
    db_student = db.query(Student).filter(Student.id == student_id).first()
    
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")

    # 2. Grab the parent User ID attached to this student (e.g., user_id: 5)
    target_user_id = db_student.user_id

    # 3. Find that exact User account
    db_user = db.query(User).filter(User.id == target_user_id).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User account not found")

    # 4. Delete the User! (Thanks to your cascade setup, this automatically deletes the Student profile too)
    db.delete(db_user)
    db.commit()
    
    return {"message": f"Student and associated User account deleted successfully"}