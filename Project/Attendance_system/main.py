from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # <-- 1. Import this
from database import engine, Base
from models.models import User, Student, Attendance
from routes import auth_routes, student_routes, attendance_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Attendance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

app.include_router(auth_routes.router)
app.include_router(student_routes.router)
app.include_router(attendance_routes.router)

@app.get("/")
def root():
    return {"message": "Attendance System Backend is Running!"}
