import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  useEffect(() => {
    if (!isAuthenticated) {
      // Only redirect if we're not already on the login page
      if (location.pathname !== '/login') {
        navigate('/login', { 
          replace: true,
          state: { from: location }
        });
      }
    }
  }, [isAuthenticated, navigate, location]);

  // If not authenticated, don't render anything
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute; 