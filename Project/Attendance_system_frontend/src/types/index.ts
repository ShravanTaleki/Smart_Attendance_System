// ─── Auth & User Types ───────────────────────────────────────────────────────

export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  full_name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ─── Student Types ────────────────────────────────────────────────────────────

export interface Student {
  id: number;
  full_name: string;
  email: string;
  student_id: string;
  grade: string;
  created_at: string;
}

export interface CreateStudentPayload {
  full_name: string;
  email: string;
  student_id: string;
  grade: string;
  password: string;
}

export interface UpdateStudentPayload {
  full_name?: string;
  email?: string;
  grade?: string;
}

// ─── Attendance Types ─────────────────────────────────────────────────────────

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: number;
  student_id: number;
  student_name: string;
  date: string;
  status: AttendanceStatus;
  marked_by: string;
  notes?: string;
}

export interface MarkAttendancePayload {
  student_id: number;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSummary {
  student_id: number;
  student_name: string;
  total_days: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendance_percentage: number;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiError {
  detail: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
