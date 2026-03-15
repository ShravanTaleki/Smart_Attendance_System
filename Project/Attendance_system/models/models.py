from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

# 1. The Users Table (Handles Login & Roles for everyone)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False) # "admin", "teacher", or "student"

    # Relationships
    student_profile = relationship("Student", back_populates="user", uselist=False,cascade="all, delete-orphan")
    attendance_marked = relationship("Attendance", back_populates="marked_by")

# 2. The Students Table (Extra details only students have)
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    
    # Changed from roll_number to student_id to match React UI
    student_id = Column(String, unique=True, nullable=False) 
    
    # Added grade field as required by the UI
    grade = Column(String, nullable=True) 

    # Relationships
    user = relationship("User", back_populates="student_profile")
    attendance_records = relationship("Attendance", back_populates="student")

# 3. The Attendance Table (The daily tracking)
class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    date = Column(Date, default=datetime.date.today, nullable=False)
    status = Column(String, nullable=False) # "Present" or "Absent"
    marked_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    student = relationship("Student", back_populates="attendance_records")
    marked_by = relationship("User", back_populates="attendance_marked")