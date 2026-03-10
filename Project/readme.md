# 🎓 Student Attendance Management System

A modern, full-stack solution for tracking student attendance. This system features a minimalist "Inter" design and a robust FastAPI/PostgreSQL backend.

## 🌟 Features
* **Teacher Dashboard:** 
    * Mark attendance for an entire class in one click (Bulk Marking).
    * View historical attendance records by date.
* **Student Dashboard:** 
    * View personal attendance history.
    * Automatic calculation of attendance percentage.
* **Admin Features:** 
    * Low attendance reporting (Threshold-based).
* **Security:** 
    * Role-based access control (Admin, Teacher, Student).
    * JWT-based authentication.

---

## 🏗️ Project Structure
```text
attendance-system/
├── frontend/             # React (TypeScript) Web App
└── backend/              # FastAPI (Python) & SQLAlchemy
```

---

## ⚙️ Installation & Setup

### 1. Backend Setup
1. Navigate to the `backend/` directory.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables:**
    * Copy `.env.example` to a new file named `.env`.
    * Update `DATABASE_URL` with your local PostgreSQL credentials.
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### 2. Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## 🛠️ Tech Stack
* **Frontend:** React 18, TypeScript, Lucide Icons.
* **Backend:** FastAPI, SQLAlchemy (ORM), PostgreSQL.
* **Authentication:** JWT (JSON Web Tokens) & Passlib (Bcrypt).

---

* The `.env` file is ignored; ensure colleagues use the `.env.example` template.
* Database migrations should be handled via SQLAlchemy's `Base.metadata.create_all(bind=engine)` or Alembic if set up.