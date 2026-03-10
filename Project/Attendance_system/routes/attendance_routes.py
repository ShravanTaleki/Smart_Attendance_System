from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List,Optional
from database import get_db
from schemas.schemas import AttendanceResponse, AttendanceCreateBulk 
from services import attendance_service
from utils.dependencies import get_current_user
from models.models import User,Student
from datetime import date

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])

# 1. BULK MARKING (The "Phase 2" upgrade)
@router.post("/bulk")
def mark_bulk_attendance(
    data: AttendanceCreateBulk, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Marks attendance for multiple students at once (e.g., a whole class)"""
    # Security: Block students
    if current_user.get("role") == "student":
        raise HTTPException(status_code=403, detail="Students cannot mark attendance")
    
    # Extract email from the JWT token
    user_email = current_user.get("sub")
    
    # Find the real user in the database to get their true ID
    db_user = db.query(User).filter(User.email == user_email).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="Teacher not found")

    # Pass the real database ID down the chain!
    return attendance_service.submit_bulk_attendance(
        db=db, 
        data=data, 
        admin_id=db_user.id 
    )

# 2. INDIVIDUAL SUMMARY
@router.get("/summary/{student_id}")
def get_summary(
    student_id: int, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return attendance_service.get_attendance_summary(db, student_id)

# 3. LOW ATTENDANCE REPORT
@router.get("/report/low-attendance")
def low_attendance_report(
    threshold: float = 75.0, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") == "student":
        raise HTTPException(status_code=403, detail="Students cannot view reports")
        
    return attendance_service.get_low_attendance_students(db, threshold)

@router.get("", response_model=List[AttendanceResponse])
def get_attendance(
    date: Optional[date] = None,
    page: int = 1,
    size: int = 50,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Door #1: For the Teacher Dashboard to view records by date"""
    if current_user.get("role") == "student":
        raise HTTPException(status_code=403, detail="Students cannot view all records")
        
    return attendance_service.get_attendance_records(db, date, page, size)

@router.get("/my", response_model=List[AttendanceResponse])
def get_my_attendance(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Door #2: For the Student Dashboard to view their own history"""
    if current_user.get("role") != "student":
        raise HTTPException(status_code=403, detail="Only students can view this")
        
    # 1. Get the user's email from the token
    user_email = current_user.get("sub")
    db_user = db.query(User).filter(User.email == user_email).first()
    
    # 2. Find their Student profile using their User ID
    db_student = db.query(Student).filter(Student.user_id == db_user.id).first()
    
    if not db_student:
         raise HTTPException(status_code=404, detail="Student profile not found")
         
    # 3. Fetch their attendance!
    return attendance_service.get_student_attendance(db, db_student.id)