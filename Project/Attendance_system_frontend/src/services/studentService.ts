import { apiClient } from './apiClient';
import { Student, CreateStudentPayload, UpdateStudentPayload, PaginatedResponse } from '../types';
import { MOCK_STUDENTS } from './mockData';

// 1. TURNED OFF THE MOCK DATA
const USE_MOCK = false; 

export const studentService = {
  getAll: async (page = 1, size = 20): Promise<PaginatedResponse<Student>> => {
    if (USE_MOCK) return { items: [], total: 0, page, size };

    // ── Real API ──
    // Fetch your flat list of students from FastAPI
    const response = await apiClient.get('/students/');
    const studentsList = response.data;

    // Wrap your flat list into the Paginated format the UI expects so it doesn't crash
    return { 
        items: studentsList, 
        total: studentsList.length, 
        page: 1, 
        size: studentsList.length || 20 
    };
  },

  getById: async (id: number): Promise<Student> => {
    if (USE_MOCK) return MOCK_STUDENTS[0] as any;
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  },

  create: async (payload: CreateStudentPayload): Promise<Student> => {
    if (USE_MOCK) return MOCK_STUDENTS[0] as any;
    const response = await apiClient.post('/students/', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateStudentPayload): Promise<Student> => {
    if (USE_MOCK) return MOCK_STUDENTS[0] as any;
    const response = await apiClient.put(`/students/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    if (USE_MOCK) return;
    await apiClient.delete(`/students/${id}`);
  },
};