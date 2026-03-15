from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas.schemas import StudentCreate, StudentResponse,StudentUpdate
from models.models import User
from services import student_service
from utils.dependencies import require_role, get_current_user

router = APIRouter(prefix="/api/students", tags=["Students"])

@router.post("/", response_model=StudentResponse)
def add_student(
    student: StudentCreate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(require_role("admin")) # ONLY Admins can do this!
):
    """Creates a new student profile and login credentials"""
    return student_service.create_new_student(db, student)

@router.get("/", response_model=List[StudentResponse])
def get_students(
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user) # Any logged-in user can view this
):
    """Gets a list of all students"""
    return student_service.get_students_list(db)


@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int,
    student_update: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("admin")) # ONLY Admins!
):
    """Updates an existing student's record"""
    return student_service.update_student(db, student_id, student_update)

@router.delete("/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("admin")) # ONLY Admins!
):
    """Deletes a student and their associated records"""
    return student_service.delete_student(db, student_id)

