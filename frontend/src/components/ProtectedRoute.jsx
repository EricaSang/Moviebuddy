import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show nothing while loading to prevent flicker
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Return children if authenticated
  return children;
}

export default ProtectedRoute; 