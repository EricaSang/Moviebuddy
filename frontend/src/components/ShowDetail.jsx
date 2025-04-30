import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useAuth } from '../context/AuthContext';
import './ShowDetail.css'; // Import the CSS file for styling

function ShowDetail() {
  const { id } = useParams(); // Get the movie ID from the URL
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null); // State to hold movie details
  const [similarMovies, setSimilarMovies] = useState([]); // State to hold similar movies
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [loadingRating, setLoadingRating] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [error, setError] = useState(null); // State to manage error
  
  // New state variables for features
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [movieRatings, setMovieRatings] = useState([]);
  const [animateReviews, setAnimateReviews] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [hoverRating, setHoverRating] = useState(0);

  // Base API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch movie details
        const movieResponse = await axios.get(`${API_URL}/movies/${id}/`);
        if (movieResponse.data) {
          setMovie(movieResponse.data.movies);
          setSimilarMovies(movieResponse.data.similar_movies || []);
          
          // Fetch recommended movies
          try {
            const recommendedResponse = await axios.get(`${API_URL}/movies/recommended/`);
            setRecommendedMovies(recommendedResponse.data.recommended_movies || []);
          } catch (error) {
            console.error('Error fetching recommended movies:', error);
          }
          
          // Fetch all ratings and reviews
          try {
            const ratingsResponse = await axios.get(`${API_URL}/movies/${id}/ratings/`);
            setMovieRatings(ratingsResponse.data.ratings || []);
          } catch (error) {
            console.error('Error fetching ratings:', error);
          }

          // Check watchlist status
          try {
            const watchlistResponse = await axios.get(`${API_URL}/watchlist/`);
            const watchlistItem = watchlistResponse.data.find(item => item.movie === parseInt(id));
            if (watchlistItem) {
              setInWatchlist(true);
              setIsWatched(watchlistItem.watched);
            }
          } catch (error) {
            console.error('Error fetching watchlist:', error);
          }

          // Check user rating
          try {
            const ratingResponse = await axios.get(`${API_URL}/ratings/${id}/`);
            if (ratingResponse.data) {
              setUserRating(ratingResponse.data.rating);
              setReviewText(ratingResponse.data.review || '');
            }
          } catch (error) {
            if (error.response?.status !== 404) {
              console.error('Error fetching user rating:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
        if (error.response) {
          setError(error.response.data?.error || 'Failed to load movie details');
        } else if (error.request) {
          setError('Unable to connect to the server. Please check your internet connection.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, isAuthenticated, API_URL]);

  const handleAddToWatchlist = async () => {
    try {
      setLoadingWatchlist(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please log in to manage your watchlist');
        return;
      }

      const response = await axios.post(
        `${API_URL}/watchlist/`,
        { movie_id: id },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data) {
        setInWatchlist(true);
        setIsWatched(response.data.watched);
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      setError(error.response?.data?.error || 'Failed to add to watchlist');
    } finally {
      setLoadingWatchlist(false);
    }
  };
  
  const handleRemoveFromWatchlist = async () => {
    try {
      setLoadingWatchlist(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please log in to manage your watchlist');
        return;
      }

      const response = await axios.delete(
        `${API_URL}/watchlist/${id}/`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.status === 204) {
        setInWatchlist(false);
        setIsWatched(false);
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      setError(error.response?.data?.error || 'Failed to remove from watchlist');
    } finally {
      setLoadingWatchlist(false);
    }
  };
  
  const handleToggleWatched = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please log in to update watched status');
        return;
      }

      const response = await axios.put(
        `${API_URL}/watchlist/${id}/watched/`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data) {
        setIsWatched(response.data.watched);
      }
    } catch (error) {
      console.error('Error updating watched status:', error);
      setError(error.response?.data?.error || 'Failed to update watched status');
    }
  };
  
  const handleRatingSubmit = async (rating) => {
    try {
      setLoadingRating(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(
        `${API_URL}/ratings/`,
        { 
          movie_id: id, 
          rating,
          review: reviewText || null
        },
        { headers }
      );
      if (response.data) {
        setUserRating(response.data.rating);
        setReviewText(response.data.review || '');
        setShowReviewForm(false);
        // Refresh all ratings
        const ratingsResponse = await axios.get(`${API_URL}/movies/${id}/ratings/`);
        setMovieRatings(ratingsResponse.data || []);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      if (error.response) {
        setError(error.response.data?.error || 'Failed to submit rating');
      } else if (error.request) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoadingRating(false);
    }
  };
  
  const handleReviewSubmit = async () => {
    try {
      setLoadingRating(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(
        `${API_URL}/ratings/`,
        { 
          movie_id: id, 
          rating: userRating || hoverRating || 1,
          review: reviewText
        },
        { headers }
      );
      if (response.data) {
        setUserRating(response.data.rating);
        setReviewText(response.data.review || '');
        setShowReviewForm(false);
        // Refresh all ratings
        const ratingsResponse = await axios.get(`${API_URL}/movies/${id}/ratings/`);
        setMovieRatings(ratingsResponse.data || []);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response) {
        setError(error.response.data?.error || 'Failed to submit review');
      } else if (error.request) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoadingRating(false);
    }
  };
  
  const handleDeleteRating = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${API_URL}/ratings/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserRating(null);
      setRatingValue(0);
      setReviewText('');
      
      // Refresh all ratings
      const ratingsResponse = await axios.get(`${API_URL}/movies/${id}/ratings/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMovieRatings(ratingsResponse.data.ratings || []);
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert('Failed to delete rating');
    }
  };

  const getPosterUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';
  };

  const renderStars = (value, onChange, onMouseEnter, onMouseLeave) => (
    <div className="rating-stars">
      {[1,2,3,4,5,6,7,8,9,10].map(star => (
        <span
          key={star}
          className={`star ${star <= value ? 'active' : ''}`}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => onMouseEnter && onMouseEnter(star)}
          onMouseLeave={() => onMouseLeave && onMouseLeave()}
        >
          ★
        </span>
      ))}
      <span className="rating-value">{value}/10</span>
    </div>
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading-container">
      <div className="loader"></div>
      <p>Loading movie details...</p>
    </div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Unable to load movie details</h2>
        <p className="error-description">We're having trouble connecting to the server. Please try again.</p>
        <div className="error-message">
          {error}
          {error.includes('log in') && (
            <Link to="/login" className="login-link">
              Go to Login
            </Link>
          )}
        </div>
        <div className="error-actions">
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              window.location.reload();
            }} 
            className="retry-button"
          >
            Try Again
          </button>
          <Link to="/" className="back-link">
            <span className="back-icon">←</span> Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return <div className="not-found-container">No movie details available</div>;
  }

  return (
    <div className="show-detail">
      <div className="movie-backdrop" style={{ backgroundImage: `url(${getPosterUrl(movie.backdrop_path || movie.poster_path)})` }}>
        <div className="backdrop-overlay"></div>
      </div>
      
      <div className="movie-content">
        <div className="movie-header">
          <div className="poster-wrapper">
            <img 
              src={getPosterUrl(movie.poster_path)} 
              alt={movie.title} 
              className="movie-poster" 
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'; }}
            />
            
            <div className="movie-rating-badge">
              <span className="badge-value">{movie.vote_average?.toFixed(1) || '?'}</span>
              <span className="badge-max">/10</span>
            </div>
          </div>
          
          <div className="movie-details">
            <h1 className="movie-title text-bold">{movie.title}</h1>
            {movie.original_title !== movie.title && (
              <h3 className="original-title text-bold">Original Title: {movie.original_title}</h3>
            )}
            
            <div className="movie-meta text-bold">
              <span className="release-year">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}</span>
              {movie.runtime && <span className="runtime">{movie.runtime} min</span>}
              <span className="vote-count">{movie.vote_count} votes</span>
            </div>
            
            <div className="genres">
              {(() => {
                let genreList = [];
                if (typeof movie.genres === 'string') {
                  try {
                    // Handle the specific format "[{'id': 878 'name': 'Science Fiction'}]"
                    if (movie.genres.includes("'id':")) {
                      const genreMatches = movie.genres.matchAll(/'name':\s*'([^']+)'/g);
                      for (const match of genreMatches) {
                        genreList.push(match[1]);
                      }
                    } else if (movie.genres.startsWith('[') && movie.genres.endsWith(']')) {
                      // Handle JSON array format
                      const parsedGenres = JSON.parse(movie.genres.replace(/'/g, '"'));
                      genreList = parsedGenres.map(g => g.name);
                    } else {
                      // Handle comma-separated string
                      genreList = movie.genres.split(',').map(g => g.trim());
                    }
                  } catch (error) {
                    console.error('Error parsing genres:', error);
                  }
                } else if (Array.isArray(movie.genres)) {
                  genreList = movie.genres.map(g => typeof g === 'object' ? g.name : g);
                }
                
                return genreList.map(genre => (
                  <span key={genre} className="genre-tag text-bold">{genre}</span>
                ));
              })()}
            </div>
            
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews <span className="review-count">{movieRatings.length}</span>
              </button>
              <button 
                className={`tab ${activeTab === 'similar' ? 'active' : ''}`}
                onClick={() => setActiveTab('similar')}
              >
                Similar Movies
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <p className="overview text-bold">{movie.overview}</p>
                  
                  <div className="movie-actions">
                    <button
                      className="action-button"
                      onClick={inWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
                      disabled={loadingWatchlist}
                    >
                      {loadingWatchlist ? 'Loading...' : (inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist')}
                    </button>
                    {inWatchlist && (
                      <button
                        className="action-button"
                        onClick={handleToggleWatched}
                        disabled={loadingWatchlist}
                      >
                        {isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
                      </button>
                    )}
                  </div>
                  
                  {!loadingRating && (
                    <div className="rating-form-container">
                      {userRating > 0 ? (
                        <div className="user-rating">
                          <h3>Your Rating</h3>
                          <div className="rating-stars">
                            {renderStars(
                              hoverRating || userRating || 0,
                              (star) => {
                                setUserRating(star);
                                handleRatingSubmit(star);
                              },
                              (star) => setHoverRating(star),
                              () => setHoverRating(0)
                            )}
                          </div>
                          {reviewText && (
                            <div className="user-review">
                              <h4>Your Review</h4>
                              <p>{reviewText}</p>
                            </div>
                          )}
                          <button 
                            className="action-button"
                            onClick={() => {
                              setUserRating(null);
                              setReviewText('');
                              setShowReviewForm(true);
                            }}
                          >
                            Edit Rating & Review
                          </button>
                          <button
                            className="action-button cancel-button"
                            onClick={() => {
                              setUserRating(0);
                              handleRatingSubmit(0);
                            }}
                          >
                            Clear Rating
                          </button>
                        </div>
                      ) : (
                        <div className="rating-form">
                          <h3>Rate this Movie</h3>
                          <div className="rating-stars">
                            {renderStars(
                              hoverRating || 0,
                              (star) => {
                                setUserRating(star);
                                handleRatingSubmit(star);
                              },
                              (star) => setHoverRating(star),
                              () => setHoverRating(0)
                            )}
                          </div>
                          {showReviewForm && (
                            <div className="review-form">
                              <textarea
                                className="review-textarea"
                                placeholder="Write your review (optional)"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                rows="4"
                              />
                              <div className="review-actions">
                                <button 
                                  className="action-button"
                                  onClick={handleReviewSubmit}
                                  disabled={loadingRating}
                                >
                                  {loadingRating ? 'Submitting...' : 'Submit Review'}
                                </button>
                                <button 
                                  className="action-button cancel-button"
                                  onClick={() => {
                                    setShowReviewForm(false);
                                    setReviewText('');
                                    setUserRating(null);
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="reviews-tab">
                  {movieRatings.length > 0 ? (
                    <div className={`ratings-list ${animateReviews ? 'animate' : ''}`}>
                      {movieRatings.map((rating, index) => (
                        <div key={rating.id || index} className="rating-card" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="rating-header">
                            <div className="rating-user-info">
                              <span className="rating-username">{rating.username}</span>
                              <div className="user-rating">
                                {renderStars(rating.rating)}
                              </div>
                            </div>
                            <span className="rating-date">{formatDate(rating.created_at || rating.updated_at || new Date())}</span>
                          </div>
                          {rating.review && (
                            <div className="rating-review">
                              <p>{rating.review}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-reviews">
                      <p>No reviews yet. Be the first to review this movie!</p>
                      <button 
                        className="write-review-btn"
                        onClick={() => {
                          setActiveTab('overview');
                          setShowReviewForm(true);
                        }}
                      >
                        Write a Review
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'similar' && (
                <div className="similar-tab">
                  {similarMovies.length > 0 ? (
                    <div className="movie-grid">
                      {similarMovies.map((movie, index) => (
                        <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="movie-poster-container">
                            <img 
                              src={getPosterUrl(movie.poster_path)} 
                              alt={movie.title} 
                              className="movie-poster-thumb" 
                              onError={(e) => { e.target.onerror = null; e.target.src = 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'; }}
                            />
                            <div className="movie-poster-overlay">
                              <div className="overlay-rating">{movie.vote_average?.toFixed(1) || '?'}</div>
                            </div>
                          </div>
                          <h3 className="movie-card-title">{movie.title}</h3>
                          <div className="movie-card-year">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="no-similar-movies">
                      <p>No similar movies found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="recommended-section">
        <h2>Recommended For You</h2>
        <div className="recommended-movies">
          {recommendedMovies && recommendedMovies.length > 0 ? (
            <div className="movie-slider">
              {recommendedMovies.map(movie => (
                <Link to={`/movie/${movie.id}`} key={movie.id} className="recommended-movie">
                  <div className="recommended-poster-container">
                    <img 
                      src={getPosterUrl(movie.poster_path)} 
                      alt={movie.title} 
                      className="recommended-poster" 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'; }}
                    />
                    <div className="recommended-poster-overlay">
                      <div className="recommended-rating">⭐ {movie.vote_average?.toFixed(1) || '?'}</div>
                    </div>
                  </div>
                  <h3 className="recommended-title">{movie.title}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-recommendations">
              <p>Continue watching and rating movies to get personalized recommendations.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="back-navigation">
        <Link to="/" className="back-link">
          <span className="back-icon">←</span> Back to Movies
        </Link>
      </div>
    </div>
  );
}

export default ShowDetail;