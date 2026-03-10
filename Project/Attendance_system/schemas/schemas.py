from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date

class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str  # Must be "admin", "teacher", or "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str =Field(..., max_length=70)

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str

    class Config:
        from_attributes = True 


class StudentCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    student_id: str
    grade: str

class StudentResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    student_id: str
    grade: str
    email: str

    class Config:
        from_attributes = True


# ATTENDANCE SCHEMAS

class AttendanceMark(BaseModel):
    student_id: int
    status: str  # "Present" or "Absent"


class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    date: date
    status: str
    marked_by_id: int

    class Config:
        from_attributes = True

class AttendanceCreateBulk(BaseModel):
    date: date
    records: List[AttendanceMark]
