import { User, Student, AttendanceRecord, AttendanceSummary } from '../types';

// ─── Mock Users ───────────────────────────────────────────────────────────────
export const MOCK_USERS: (User & { password: string })[] = [
  { id: 1, username: 'admin',   password: 'admin123',   role: 'admin',   full_name: 'Admin User',      email: 'admin@school.edu' },
  { id: 2, username: 'teacher', password: 'teacher123', role: 'teacher', full_name: 'Sarah Johnson',   email: 'sarah@school.edu' },
  { id: 3, username: 'student', password: 'student123', role: 'student', full_name: 'Alex Thompson',   email: 'alex@school.edu'  },
];

// ─── Mock Students ────────────────────────────────────────────────────────────
export const MOCK_STUDENTS: Student[] = [
  { id: 1, full_name: 'Alex Thompson',   email: 'alex@school.edu',    student_id: 'STU001', grade: '10-A', created_at: '2024-01-10' },
  { id: 2, full_name: 'Maria Garcia',    email: 'maria@school.edu',   student_id: 'STU002', grade: '10-A', created_at: '2024-01-10' },
  { id: 3, full_name: 'James Wilson',    email: 'james@school.edu',   student_id: 'STU003', grade: '10-B', created_at: '2024-01-11' },
  { id: 4, full_name: 'Priya Patel',     email: 'priya@school.edu',   student_id: 'STU004', grade: '10-B', created_at: '2024-01-11' },
  { id: 5, full_name: 'Chris Lee',       email: 'chris@school.edu',   student_id: 'STU005', grade: '10-A', created_at: '2024-01-12' },
  { id: 6, full_name: 'Aisha Malik',     email: 'aisha@school.edu',   student_id: 'STU006', grade: '10-C', created_at: '2024-01-12' },
  { id: 7, full_name: 'David Kim',       email: 'david@school.edu',   student_id: 'STU007', grade: '10-C', created_at: '2024-01-13' },
  { id: 8, full_name: 'Emily Chen',      email: 'emily@school.edu',   student_id: 'STU008', grade: '10-A', created_at: '2024-01-13' },
];

// ─── Mock Attendance Records ──────────────────────────────────────────────────
export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id:  1, student_id: 1, student_name: 'Alex Thompson', date: '2025-03-10', status: 'present', marked_by: 'Sarah Johnson' },
  { id:  2, student_id: 2, student_name: 'Maria Garcia',  date: '2025-03-10', status: 'absent',  marked_by: 'Sarah Johnson', notes: 'Called in sick' },
  { id:  3, student_id: 3, student_name: 'James Wilson',  date: '2025-03-10', status: 'present', marked_by: 'Sarah Johnson' },
  { id:  4, student_id: 4, student_name: 'Priya Patel',   date: '2025-03-10', status: 'late',    marked_by: 'Sarah Johnson', notes: 'Arrived 15 min late' },
  { id:  5, student_id: 5, student_name: 'Chris Lee',     date: '2025-03-10', status: 'present', marked_by: 'Sarah Johnson' },
  { id:  6, student_id: 6, student_name: 'Aisha Malik',   date: '2025-03-10', status: 'excused', marked_by: 'Sarah Johnson', notes: 'Doctor appointment' },
  { id:  7, student_id: 7, student_name: 'David Kim',     date: '2025-03-10', status: 'present', marked_by: 'Sarah Johnson' },
  { id:  8, student_id: 8, student_name: 'Emily Chen',    date: '2025-03-10', status: 'present', marked_by: 'Sarah Johnson' },
  { id:  9, student_id: 1, student_name: 'Alex Thompson', date: '2025-03-09', status: 'present', marked_by: 'Sarah Johnson' },
  { id: 10, student_id: 1, student_name: 'Alex Thompson', date: '2025-03-08', status: 'absent',  marked_by: 'Sarah Johnson', notes: 'No reason given' },
  { id: 11, student_id: 1, student_name: 'Alex Thompson', date: '2025-03-07', status: 'present', marked_by: 'Sarah Johnson' },
  { id: 12, student_id: 1, student_name: 'Alex Thompson', date: '2025-03-06', status: 'late',    marked_by: 'Sarah Johnson' },
  { id: 13, student_id: 2, student_name: 'Maria Garcia',  date: '2025-03-09', status: 'present', marked_by: 'Sarah Johnson' },
  { id: 14, student_id: 3, student_name: 'James Wilson',  date: '2025-03-09', status: 'present', marked_by: 'Sarah Johnson' },
  { id: 15, student_id: 4, student_name: 'Priya Patel',   date: '2025-03-09', status: 'absent',  marked_by: 'Sarah Johnson' },
];

// ─── Mock Attendance Report ───────────────────────────────────────────────────
export const MOCK_REPORT: AttendanceSummary[] = [
  { student_id: 1, student_name: 'Alex Thompson', total_days: 20, present: 16, absent: 2, late: 2, excused: 0, attendance_percentage: 80.0 },
  { student_id: 2, student_name: 'Maria Garcia',  total_days: 20, present: 18, absent: 2, late: 0, excused: 0, attendance_percentage: 90.0 },
  { student_id: 3, student_name: 'James Wilson',  total_days: 20, present: 19, absent: 0, late: 1, excused: 0, attendance_percentage: 95.0 },
  { student_id: 4, student_name: 'Priya Patel',   total_days: 20, present: 15, absent: 3, late: 2, excused: 0, attendance_percentage: 75.0 },
  { student_id: 5, student_name: 'Chris Lee',     total_days: 20, present: 20, absent: 0, late: 0, excused: 0, attendance_percentage: 100.0 },
  { student_id: 6, student_name: 'Aisha Malik',   total_days: 20, present: 17, absent: 1, late: 0, excused: 2, attendance_percentage: 85.0 },
  { student_id: 7, student_name: 'David Kim',     total_days: 20, present: 14, absent: 4, late: 2, excused: 0, attendance_percentage: 70.0 },
  { student_id: 8, student_name: 'Emily Chen',    total_days: 20, present: 19, absent: 1, late: 0, excused: 0, attendance_percentage: 95.0 },
];
