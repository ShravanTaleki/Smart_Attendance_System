import { User, Role } from '../types';

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'current_user';

// ─── Token Management ─────────────────────────────────────────────────────────

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// ─── User Management ──────────────────────────────────────────────────────────

export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// ─── Session ──────────────────────────────────────────────────────────────────

export const clearSession = (): void => {
  removeToken();
  removeUser();
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

// ─── JWT Decode (simple, no library) ─────────────────────────────────────────

export const decodeToken = (token: string): Record<string, unknown> | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || typeof decoded.exp !== 'number') return true;
  return decoded.exp * 1000 < Date.now();
};

// ─── Role Helpers ─────────────────────────────────────────────────────────────

export const getDashboardPath = (role: Role): string => {
  const paths: Record<Role, string> = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
  };
  return paths[role];
};

export const hasPermission = (userRole: Role, requiredRole: Role): boolean => {
  const hierarchy: Record<Role, number> = {
    admin: 3,
    teacher: 2,
    student: 1,
  };
  return hierarchy[userRole] >= hierarchy[requiredRole];
};
