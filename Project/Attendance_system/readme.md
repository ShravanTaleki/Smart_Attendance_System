# Smart Attendance System - Backend API

This is the backend API for the Smart Attendance System, built with FastAPI, SQLAlchemy, and PostgreSQL. It features secure JWT authentication, role-based access control (Admin, Teacher, Student), and daily attendance tracking.

## 🛠️ Tech Stack
* **Framework:** FastAPI
* **Database:** PostgreSQL
* **ORM:** SQLAlchemy
* **Data Validation:** Pydantic
* **Authentication:** JWT (JSON Web Tokens) & Bcrypt

---

## 🚀 Local Setup & Installation

Follow these steps to get the backend running on your local machine.

### 1. Prerequisites
* Python 3.8 or higher installed
* PostgreSQL and pgAdmin installed

### 2. Database Setup
1. Open pgAdmin.
2. Create a new database named exactly: `smart_attendance_db`

### 3. Environment Setup
1. Open your terminal and navigate to the project folder.
2. Create a virtual environment:
   python -m venv venv
3. Activate the virtual environment:
   * **Windows:** `venv\Scripts\activate`
   * **Mac/Linux:** `source venv/bin/activate`
4. Install the dependencies:
   pip install -r requirements.txt

### 4. Environment Variables

Create a `.env` file in the root directory of the project and add the following:

DB_PASSWORD=your_postgres_password_here
SECRET_KEY=my_super_secret_attendance_key_123

### 5. Run the Server

Start the FastAPI server using Uvicorn:

uvicorn main:app --reload

The server will start at: http://127.0.0.1:8000
You can view the interactive API documentation (Swagger UI) at: http://127.0.0.1:8000/docs

---

## 📡 API Endpoints Reference

*Note: All protected routes require a JWT Bearer Token in the Authorization header.*

### Authentication (`/api/auth`)
* `POST /register` - Register a new user (Admin, Teacher, or Student).
* `POST /login` - Login to receive a JWT access token.

### Students (`/api/students`)
* `POST /` - Create a new student profile and linked user account **(Admin only)**.
* `GET /` - Get a list of all students **(Protected)**.

### Attendance (`/api/attendance`)
* `POST /` - Mark a student as "Present" or "Absent" for today **(Admin/Teacher only)**.
* `GET /summary/{student_id}` - Get a specific student's total attendance percentage **(Protected)**.
* `GET /report/low-attendance` - Get a list of all students below the 75% attendance threshold **(Admin/Teacher only)**.

---

**Developed for the Smart Attendance System Project**