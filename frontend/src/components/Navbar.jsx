import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Track scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🎬</span>
            <span className="brand-text">MovieBuddy</span>
          </Link>
        </div>
        
        {user && (
          <div className={`navbar-center ${menuOpen ? 'active' : ''}`}>
            <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="navbar-search-input"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              <button type="submit" className="navbar-search-btn">🔍</button>
            </form>
            <div className="nav-links">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Home</span>
              </Link>
              
              <Link 
                to="/watchlist" 
                className={`nav-link ${location.pathname === '/watchlist' ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-icon">📋</span>
                <span className="nav-text">My Watchlist</span>
              </Link>
            </div>
          </div>
        )}
        
        <div className="navbar-right">
          {user ? (
            <div className="user-controls">
              <div className="user-profile">
                <span className="user-avatar">{user.username.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.username}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login">
                <span className="btn-icon">🔑</span>
                <span className="btn-text">Login</span>
              </Link>
              <Link to="/register" className="auth-btn signup">
                <span className="btn-icon">✨</span>
                <span className="btn-text">Sign Up</span>
              </Link>
            </div>
          )}
        </div>
        
        <div className={`burger-menu ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 