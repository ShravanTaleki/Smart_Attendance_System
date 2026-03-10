import { apiClient } from './apiClient';
import { LoginCredentials, LoginResponse } from '../types';
import { MOCK_USERS } from './mockData';

// Changed this to false so it actually talks to your FastAPI backend
const USE_MOCK = false; 

// ─── Mock JWT generator (base64 only, not real signed JWT) ───────────────────
const makeMockToken = (userId: number): string => {
  const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: userId, exp: Date.now() / 1000 + 86400 }));
  return `${header}.${payload}.mock_signature`;
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600)); // simulate network delay
      const found = MOCK_USERS.find(
        u => u.username === credentials.username && u.password === credentials.password
      );
      if (!found) throw { response: { data: { detail: 'Invalid username or password.' } } };
      const { password, ...user } = found;
      return { access_token: makeMockToken(user.id), token_type: 'bearer', user };
    }

    // ── Real API ──
    // Sending standard JSON to match what your FastAPI backend expects
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email: credentials.username,  // Mapping their 'username' input to our 'email' field
      password: credentials.password
    });
    
    return response.data;
  },

  logout: async (): Promise<void> => {
    if (USE_MOCK) return;
    try { await apiClient.post('/auth/logout'); } catch {}
  },

  getCurrentUser: async () => {
    if (USE_MOCK) return null;
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};