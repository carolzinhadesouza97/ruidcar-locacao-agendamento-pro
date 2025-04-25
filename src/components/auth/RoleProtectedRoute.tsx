
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { UserRole } from '@/hooks/useAuth';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/'
}) => {
  const { user, loading } = useAuthContext();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  // If requiredRole is not specified, allow access to any authenticated user
  if (!requiredRole) {
    return <>{children}</>;
  }

  // If requiredRole is an array, check if user has any of the roles
  if (Array.isArray(requiredRole)) {
    if (!user.role || !requiredRole.includes(user.role)) {
      return <Navigate to="/unauthorized" />;
    }
  } 
  // If requiredRole is a single role, check if user has that role
  else if (!user.role || user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  // Allow access
  return <>{children}</>;
};

export default RoleProtectedRoute;
