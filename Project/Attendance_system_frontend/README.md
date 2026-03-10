# Smart Attendance Tracking System — Frontend

React + TypeScript frontend for a role-based attendance tracking system.

## Tech Stack

- **React 18** + **TypeScript**
- **React Router v6** — client-side routing & protected routes
- **Axios** — HTTP client with JWT interceptors
- **LocalStorage** — JWT token & user session persistence

---

## Folder Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.tsx          # Top navigation bar (role-aware)
│   │   └── ProtectedRoute.tsx  # Route guard for RBAC
├── hooks/
│   └── useAuth.tsx             # Auth context + useAuth hook
├── pages/
│   ├── LoginPage.tsx           # Public login page
│   ├── AdminDashboard.tsx      # Admin home
│   ├── TeacherDashboard.tsx    # Teacher home
│   ├── StudentDashboard.tsx    # Student home
│   ├── StudentManagementPage.tsx  # Admin: CRUD students
│   └── AttendancePage.tsx      # Multi-mode attendance page
├── services/
│   ├── apiClient.ts            # Axios instance + interceptors
│   ├── authService.ts          # Login / logout / me
│   ├── studentService.ts       # CRUD students
│   └── attendanceService.ts    # Mark / view attendance
├── types/
│   └── index.ts                # All TypeScript interfaces
├── utils/
│   └── auth.ts                 # Token helpers, role helpers
├── App.tsx                     # Route definitions
└── index.tsx                   # Entry point
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env
# Edit .env — set REACT_APP_API_URL to your FastAPI backend

# 3. Run dev server
npm start
```

---

## Roles & Routes

| Role    | Routes                                              |
|---------|-----------------------------------------------------|
| Admin   | /admin/dashboard, /admin/students, /admin/attendance |
| Teacher | /teacher/dashboard, /teacher/attendance, /teacher/records |
| Student | /student/dashboard, /student/attendance             |

Login redirects automatically based on the `role` field returned by the API.

---

## API Contract (FastAPI)

### Auth
| Method | Path         | Body / Notes                              |
|--------|--------------|-------------------------------------------|
| POST   | /auth/login  | form-encoded `username` + `password`      |
| POST   | /auth/logout | Bearer token required                     |
| GET    | /auth/me     | Returns current user                      |

**Login response:**
```json
{
  "access_token": "...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@school.edu",
    "role": "admin",
    "full_name": "Admin User"
  }
}
```

### Students (Admin only)
| Method | Path            |
|--------|-----------------|
| GET    | /students       |
| POST   | /students       |
| PUT    | /students/{id}  |
| DELETE | /students/{id}  |

### Attendance
| Method | Path                  | Who      |
|--------|-----------------------|----------|
| GET    | /attendance           | Admin/Teacher |
| GET    | /attendance/my        | Student  |
| POST   | /attendance           | Teacher  |
| PUT    | /attendance/{id}      | Teacher  |
| GET    | /attendance/report    | Admin    |

---

## Protected Route Logic

```
/login  →  public
/admin/*   →  requires role: admin
/teacher/* →  requires role: teacher
/student/* →  requires role: student (or higher)
```

Unauthenticated users are redirected to `/login`.
Users accessing a route above their role are redirected to their own dashboard.
