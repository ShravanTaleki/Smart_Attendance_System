from sqlalchemy.orm import Session
from models.models import Attendance
from datetime import date
from schemas.schemas import AttendanceCreateBulk

def get_attendance_by_date(db: Session, student_id: int, target_date: date):
    """Checks if attendance is already marked for a specific day"""
    return db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.date == target_date
    ).first()

def mark_attendance_bulk(db: Session, records: list, target_date: date, marked_by_id: int):
    """
    Saves attendance for multiple students at once.
    'records' should be a list of dicts/objects with student_id and status.
    """
    new_records = []
    
    # Optional: Delete existing records for this date if you want to allow "re-marking"
    db.query(Attendance).filter(Attendance.date == target_date).delete()

    for rec in records:
        new_record = Attendance(
            student_id=rec.student_id,
            date=target_date,
            status=rec.status,
            marked_by_id=marked_by_id
        )
        db.add(new_record)
        new_records.append(new_record)
    
    db.commit()
    # Note: We don't refresh every single record in bulk to save performance
    return new_records

def mark_single_attendance(db: Session, student_id: int, status: str, marked_by_id: int):
    """Saves a single daily attendance record"""
    new_record = Attendance(
        student_id=student_id,
        date=date.today(),
        status=status,
        marked_by_id=marked_by_id
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

def get_student_records(db: Session, student_id: int):
    """Fetches all records for a single student to calculate percentages"""
    return db.query(Attendance).filter(Attendance.student_id == student_id).all()

def get_all_attendance_for_date(db: Session, target_date: date):
    """Fetches attendance for all students for a specific date (Useful for the UI list)"""
    return db.query(Attendance).filter(Attendance.date == target_date).all()

def save_bulk_attendance(db: Session, data: AttendanceCreateBulk, admin_id: int):
    print(f"DEBUG 3 (Repository): About to save to DB with marked_by_id: {admin_id}")
    
    target_date = data.date 
    
    for rec in data.records:
        existing = db.query(Attendance).filter(
            Attendance.student_id == rec.student_id,
            Attendance.date == target_date
        ).first()

        if existing:
            existing.status = rec.status
            existing.marked_by_id = admin_id
        else:
            new_entry = Attendance(
                student_id=rec.student_id,
                date=target_date,
                status=rec.status,
                marked_by_id=admin_id
            )
            db.add(new_entry)
            
    db.commit()
    return {"detail": f"Attendance for {target_date} processed successfully"}


def get_records_by_date(db: Session, target_date: date, skip: int = 0, limit: int = 50):
    """Fetches attendance for the Teacher Dashboard based on the date."""
    query = db.query(Attendance)
    if target_date:
        query = query.filter(Attendance.date == target_date)
    return query.offset(skip).limit(limit).all()

def get_records_for_student(db: Session, student_id: int):
    """Fetches attendance history for a single student."""
    return db.query(Attendance).filter(Attendance.student_id == student_id).order_by(Attendance.date.desc()).all()