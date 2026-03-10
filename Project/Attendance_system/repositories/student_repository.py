from sqlalchemy.orm import Session
from models.models import Student,User


def get_all_students(db: Session):
    # This joins the Student table with the User table
    results = db.query(Student, User.email).join(User, Student.user_id == User.id).all()
    
    students = []
    for student_obj, email in results:
        # We manually attach the email from the User table to the Student object
        student_obj.email = email 
        students.append(student_obj)
        
    return students

def create_student_profile(db: Session, user_id: int, full_name: str, student_id: str, grade: str):
    db_student = Student(
        user_id=user_id,
        full_name=full_name,
        student_id=student_id,
        grade=grade
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student