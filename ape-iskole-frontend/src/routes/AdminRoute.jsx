import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * AdminRoute Guard
 * @param {string} requiredRole - The role required to access the route (e.g., 'super_admin', 'school_admin')
 * @param {JSX.Element} children - The component to render if authorized
 */
const AdminRoute = ({ children, requiredRole }) => {
  const { authenticated, loading, userProfile, hasRole, login } = useAuth();

  // Wait for both Keycloak initialization and Backend Synchronization
  if (loading || (authenticated && !userProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 font-medium italic">Verifying administrative permissions...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    login();
    return null;
  }

  // Cross-check: The user must have the role in Keycloak AND it must match their synced profile
  const isAuthorized = requiredRole ? hasRole(requiredRole) : true;

  if (!isAuthorized) {
    console.error(`SECURITY ALERT: Unauthorized access attempt to ${window.location.pathname}. Required: ${requiredRole}`);
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default AdminRoute;