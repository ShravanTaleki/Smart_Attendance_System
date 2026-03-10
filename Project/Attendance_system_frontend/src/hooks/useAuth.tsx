import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, LoginCredentials } from '../types';
import { authService } from '../services/authService';
import {
  saveToken,
  saveUser,
  getToken,
  getUser,
  clearSession,
  isTokenExpired,
  getDashboardPath,
} from '../utils/auth';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  getDashboard: () => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session on mount
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && storedUser && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setUser(storedUser);
    } else if (storedToken) {
      clearSession();
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    // 1. Get the token from the backend
    const authData = await authService.login(credentials);
    
    // 2. Save and set the token globally
    saveToken(authData.access_token);
    setToken(authData.access_token);

    // 3. Fetch the actual user profile (important for role-based redirect)
    // We call a separate endpoint because standard login only gives the token
    try {
      const userData = await authService.getCurrentUser(); 
      saveUser(userData);
      setUser(userData);
    } catch (error) {
      // If fetching the user fails, clear the token to prevent a broken state
      clearSession();
      setToken(null);
      throw new Error("Login succeeded but failed to fetch user profile.");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout request failed on server, clearing local session anyway.");
    } finally {
      clearSession();
      setToken(null);
      setUser(null);
    }
  };

  const getDashboard = (): string => {
    if (!user) return '/login';
    // role is cast to Role type to match getDashboardPath signature
    return getDashboardPath(user.role as Role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!(user && token),
        isLoading,
        login,
        logout,
        getDashboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};