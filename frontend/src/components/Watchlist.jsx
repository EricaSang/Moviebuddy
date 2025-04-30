import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Watchlist.css';

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please log in to view your watchlist');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/watchlist/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWatchlist(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setError(error.response?.data?.error || 'Failed to load watchlist');
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please log in to manage your watchlist');
        return;
      }

      await axios.delete(`${API_URL}/watchlist/${movieId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the watchlist state after successful removal
      setWatchlist(watchlist.filter(item => item.movie_details.id !== movieId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      alert(error.response?.data?.error || 'Failed to remove movie from watchlist');
    }
  };

  const handleToggleWatched = async (movieId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please log in to update watched status');
        return;
      }

      const response = await axios.put(
        `${API_URL}/watchlist/${movieId}/watched/`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Update the watchlist state after successful toggle
      setWatchlist(watchlist.map(item => {
        if (item.movie_details.id === movieId) {
          return { ...item, watched: response.data.watched };
        }
        return item;
      }));
    } catch (error) {
      console.error('Error updating watched status:', error);
      alert(error.response?.data?.error || 'Failed to update watched status');
    }
  };

  const getPosterUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';
  };

  if (loading) {
    return (
      <div className="watchlist-container loading">
        <div className="loader"></div>
        <p>Loading your watchlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watchlist-container error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/login" className="login-link">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <h1>My Watchlist</h1>
      {watchlist.length === 0 ? (
        <div className="empty-watchlist">
          <p>Your watchlist is empty</p>
          <Link to="/" className="browse-movies-link">Browse Movies</Link>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map((item) => (
            <div key={item.movie_details.id} className="watchlist-card">
              <Link to={`/movie/${item.movie_details.id}`} className="movie-link">
                <img 
                  src={getPosterUrl(item.movie_details.poster_path)} 
                  alt={item.movie_details.title} 
                  className="movie-poster"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';
                  }}
                />
                <h3 className="movie-title">{item.movie_details.title}</h3>
                <div className="movie-info">
                  <span className="release-year">
                    {item.movie_details.release_date ? new Date(item.movie_details.release_date).getFullYear() : 'N/A'}
                  </span>
                  <span className="rating">⭐ {item.movie_details.vote_average?.toFixed(1) || 'N/A'}</span>
                </div>
              </Link>
              <div className="movie-actions">
                <button 
                  className={`watched-toggle ${item.watched ? 'watched' : ''}`}
                  onClick={() => handleToggleWatched(item.movie_details.id)}
                >
                  {item.watched ? (
                    <span><i className="fas fa-eye-slash"></i> Watched</span>
                  ) : (
                    <span><i className="fas fa-eye"></i> Not Watched</span>
                  )}
                </button>
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveFromWatchlist(item.movie_details.id)}
                >
                  <i className="fas fa-trash"></i> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist; 