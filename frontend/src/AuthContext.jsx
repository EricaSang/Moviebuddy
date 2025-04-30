import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axios.get('http://127.0.0.1:8000/user/');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete axios.defaults.headers.common['Authorization'];
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', { username, password });
      
      // Check if response has our expected structure
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
        
        return response.data;
      } else {
        setError(response.data?.message || 'Login failed');
        return response.data;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      setIsAuthenticated(false);
      return err.response?.data || { status: 'failed', message: 'Login failed' };
    }
  };

  // Send OTP function
  const sendOtp = async (email) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/send-otp/', { email });
      
      return { 
        success: true,
        message: response.data.message || 'OTP sent successfully' 
      };
    } catch (err) {
      console.error('Send OTP error:', err);
      
      // Extract error message from response if available
      const errorMessage = 
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Failed to send OTP. Please try again.';
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  // Verify OTP function
  const verifyOtp = async (email, code) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/verify-otp/', { 
        email, 
        code 
      });
      
      if (response.status === 200) {
        return { 
          success: true,
          message: response.data.message || 'OTP verified successfully' 
        };
      } else {
        return { 
          success: false, 
          message: response.data.error || 'Invalid OTP' 
        };
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      return { 
        success: false, 
        message: err.response?.data?.error || 'Failed to verify OTP. Please try again.' 
      };
    }
  };

  // Register function
  const register = async (username, email, password, password2) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/register/', { 
        username, 
        email, 
        password, 
        password2 
      });
      
      if (response.status === 201) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        setUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
        return { 
          success: true,
          message: 'Registration successful' 
        };
      } else {
        return { 
          success: false, 
          message: response.data.error || 'Registration failed' 
        };
      }
    } catch (err) {
      console.error('Registration error:', err);
      return { 
        success: false, 
        message: err.response?.data?.error || 'Registration failed. Please try again.' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await axios.post('http://127.0.0.1:8000/logout/', { refresh: refreshToken });
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
      logout,
      sendOtp,
      verifyOtp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 