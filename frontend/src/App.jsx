import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ShowDetail from './components/ShowDetail';
import Login from './components/Login';
import Register from './components/Register';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import Navbar from './components/Navbar';
import Watchlist from './components/Watchlist';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/movie/:id" 
            element={
              <ProtectedRoute>
                <ShowDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/watchlist" 
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
