from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from schemas.schemas import AttendanceMark,AttendanceCreateBulk
from repositories import attendance_repository, user_repository,student_repository
from datetime import date
from models.models import Student,Attendance

def mark_daily_attendance(db: Session, attendance_data: AttendanceMark, current_user_email: str):
    # 1. Find the user ID of the teacher/admin marking the attendance
    marker = user_repository.get_user_by_email(db, current_user_email)
    
    # 2. Check if the student actually exists
    student = db.query(Student).filter(Student.id == attendance_data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # 3. Prevent marking attendance twice in one day
    today = date.today()
    existing_record = attendance_repository.get_attendance_by_date(db, attendance_data.student_id, today)
    if existing_record:
        raise HTTPException(status_code=400, detail="Attendance already marked for today")

    # 4. Save the record
    return attendance_repository.mark_attendance(
        db=db,
        student_id=attendance_data.student_id,
        status=attendance_data.status,
        marked_by_id=marker.id
    )

def get_attendance_summary(db: Session, student_id: int):
    # Fetch all records for this student
    records = attendance_repository.get_student_records(db, student_id)
    
    total_days = len(records)
    if total_days == 0:
        return {"student_id": student_id, "total_days": 0, "present_days": 0, "percentage": 0.0}

    # Count how many days they were "Present"
    present_days = sum(1 for record in records if record.status.lower() == "present")
    
    # Calculate percentage
    percentage = round((present_days / total_days) * 100, 2)
    
    return {
        "student_id": student_id,
        "total_days": total_days,
        "present_days": present_days,
        "percentage": percentage
    }

def get_low_attendance_students(db: Session, threshold: float):
    # Get all students in the database
    all_students = student_repository.get_all_students(db)
    low_attendance_list = []

    for student in all_students:
        summary = get_attendance_summary(db, student.id)
        
        # If they have records AND their percentage is below the threshold, flag them
        if summary["total_days"] > 0 and summary["percentage"] < threshold:
            low_attendance_list.append({
                "student_id": student.id,
                "name": student.full_name,          # FIX: Grab from full_name!
                "roll_number": student.student_id,  # FIX: Grab from student_id!
                "percentage": summary["percentage"]
            })
            
    return low_attendance_list


def submit_attendance(db:Session,attendance_data:list,date,admin_id:int):
    return attendance_repository.mark_attendance_bulk(db,attendance_data,date,admin_id)

def submit_bulk_attendance(db: Session, data: AttendanceCreateBulk, admin_id: int):
    print(f"DEBUG 2 (Service): Received admin_id: {admin_id}")
    
    # CRITICAL: Make sure admin_id=admin_id is inside these parentheses!
    return attendance_repository.save_bulk_attendance(
        db=db, 
        data=data, 
        admin_id=admin_id 
    )

def get_attendance_records(db: Session, target_date: date, page: int, size: int):
    # Calculate offset for pagination
    skip = (page - 1) * size
    return attendance_repository.get_records_by_date(db, target_date, skip, size)

def get_student_attendance(db: Session, student_id: int):
    return attendance_repository.get_records_for_student(db, student_id)


def get_attendance_report(db: Session):
    students = db.query(Student).all()
    report_data = []
    
    for student in students:
        # 2. THE CRITICAL QUERY FIX - We use student_id == student.id
        records = db.query(Attendance).filter(Attendance.student_id == student.id).all()
        
        total = len(records)
        
        # Count the statuses safely
        present = sum(1 for r in records if r.status.lower() == "present")
        absent = sum(1 for r in records if r.status.lower() == "absent")
        late = sum(1 for r in records if r.status.lower() == "late")
        excused = sum(1 for r in records if r.status.lower() == "excused")
        
        # Math for the frontend
        attended_days = present + late
        percent = (attended_days / total) * 100 if total > 0 else 0.0

        # Build the exact dictionary React is asking for
        report_data.append({
            "student_id": student.id, 
            "student_name": student.full_name,
            "total_days": total,
            "present": present,
            "absent": absent,
            "late": late,
            "excused": excused,
            "attendance_percentage": percent
        })
        
    return report_data