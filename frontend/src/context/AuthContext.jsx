import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_URL = 'http://localhost:8000/api';

  // Check if user is already logged in on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axios.get(`${API_URL}/user/`);
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete axios.defaults.headers.common['Authorization'];
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [API_URL]);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login/`, { username, password });
      
      if (response.data && response.data.status === 'success') {
        // Store tokens
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        
        // Set auth header for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.tokens.access}`;
        
        // Update user state
        setUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
        
        return true;
      } else {
        setError(response.data?.message || 'Login failed');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      setIsAuthenticated(false);
      return false;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register/`, { 
        username, 
        email, 
        password,
        password2: password // Add password2 field for validation
      });
      
      if (response.status === 201) {
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.tokens.access}`;
        setUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
        return true;
      } else {
        setError(response.data?.error || 'Registration failed');
        return false;
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await axios.post(`${API_URL}/logout/`, { refresh: refreshToken });
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      isAuthenticated,
      login, 
      register, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 