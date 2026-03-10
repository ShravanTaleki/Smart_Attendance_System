import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';
import { hasPermission } from '../../utils/auth';

interface ProtectedRouteProps {
  requiredRole?: Role;
}

/**
 * ProtectedRoute
 * - Redirects unauthenticated users to /login
 * - Redirects authenticated users who lack the required role to their own dashboard
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, isLoading, user, getDashboard } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: '"Inter", sans-serif',
          fontSize: '12px',
          letterSpacing: '0.1em',
          color: '#999',
        }}
      >
        LOADING...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user && !hasPermission(user.role as Role, requiredRole)) {
    return <Navigate to={getDashboard()} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
