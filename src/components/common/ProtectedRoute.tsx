import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/roles';

interface ProtectedRouteProps {
  allowedRole?: UserRole;
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole, allowedRoles, children }) => {
  const { isAuthenticated, currentRole } = useAuth();

  if (!isAuthenticated || !currentRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to={`/${currentRole.toLowerCase()}/dashboard`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Navigate to={`/${currentRole.toLowerCase()}/dashboard`} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
