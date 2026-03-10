import { apiClient } from './apiClient';
import {
  AttendanceRecord, AttendanceSummary,
  MarkAttendancePayload, PaginatedResponse,
} from '../types';
import { MOCK_ATTENDANCE, MOCK_REPORT, MOCK_STUDENTS } from './mockData';
import { getUser } from '../utils/auth';

const USE_MOCK = false;

let mockRecords: AttendanceRecord[] = [...MOCK_ATTENDANCE];
let nextId = mockRecords.length + 1;

export const attendanceService = {
  getAll: async (date?: string, page = 1, size = 50): Promise<PaginatedResponse<AttendanceRecord>> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400));
      const filtered = date ? mockRecords.filter(r => r.date === date) : mockRecords;
      return { items: filtered, total: filtered.length, page, size };
    }
    const response = await apiClient.get('/attendance', { params: { date, page, size } });
    return response.data;
  },

  getMyAttendance: async (): Promise<AttendanceRecord[]> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400));
      // student logs in as user id=3 (Alex Thompson = student_id 1 in records)
      return mockRecords.filter(r => r.student_id === 1);
    }
    const response = await apiClient.get('/attendance/my');
    return response.data;
  },

  markAttendance: async (payload: MarkAttendancePayload): Promise<AttendanceRecord> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 200));
      const user = getUser();
      // remove existing record for same student+date if any
      mockRecords = mockRecords.filter(
        r => !(r.student_id === payload.student_id && r.date === payload.date)
      );
      const record: AttendanceRecord = {
        id: nextId++,
        student_id: payload.student_id,
        student_name: MOCK_STUDENTS.find((s: any) => s.id === payload.student_id)?.full_name ?? `Student #${payload.student_id}`,
        date: payload.date,
        status: payload.status,
        marked_by: user?.full_name ?? 'Teacher',
        notes: payload.notes,
      };
      mockRecords = [...mockRecords, record];
      return record;
    }
    const response = await apiClient.post('/attendance', payload);
    return response.data;
  },

  updateAttendance: async (id: number, status: string, notes?: string): Promise<AttendanceRecord> => {
    if (USE_MOCK) {
      mockRecords = mockRecords.map(r =>
        r.id === id ? { ...r, status: status as any, notes } : r
      );
      return mockRecords.find(r => r.id === id)!;
    }
    const response = await apiClient.put(`/attendance/${id}`, { status, notes });
    return response.data;
  },

  // Add these to your attendanceService object
 submitBulk: async (payload: { date: string; records: any[] }) => {
   if (USE_MOCK) {
     console.log("Mock Bulk Save:", payload);
     return { detail: "Success" };
   }
   const response = await apiClient.post('/attendance/bulk', payload);
   return response.data;
 },

 getReport: async (): Promise<AttendanceSummary[]> => {
    if (USE_MOCK) return MOCK_REPORT;
   const response = await apiClient.get('/attendance/report');
   return response.data;
 },
};
