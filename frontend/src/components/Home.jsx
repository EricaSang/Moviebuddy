import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const API_URL = 'http://localhost:8000/api'; // Fixed API base URL
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for recommendations
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [mostWatchedMovies, setMostWatchedMovies] = useState([]);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Genre selection for the genre-based section
  const [selectedGenreForSuggestions, setSelectedGenreForSuggestions] = useState('');
  const [genreBasedMovies, setGenreBasedMovies] = useState({});
  
  // Filter options (for populating dropdowns)
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [years, setYears] = useState([]);
  
  // Email subscription
  const [email, setEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  
  // Genre ID to name mapping - moved to component scope
  const genreMap = {
    '36': 'History',
    '37': 'Western',
    '80': 'Crime',
    '878': 'Science Fiction',
    '9648': 'Mystery',
    '99': 'Documentary',
    '10769': 'Foreign',
    '16': 'Animation',
    '18': 'Drama',
    '27': 'Horror',
    '28': 'Action',
    '35': 'Comedy',
    '10402': 'Music',
    '10749': 'Romance',
    '10751': 'Family',
    '10752': 'War',
    '10770': 'TV Movie',
    '12': 'Adventure',
    '14': 'Fantasy',
    '53': 'Thriller'
  };
  
  const location = useLocation();
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get auth token from localStorage
        const token = localStorage.getItem('accessToken');
        console.log('Using token:', token ? 'Token exists' : 'No token');
        
        // Prepare headers for authenticated requests
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};
        
        // Log the full API URL we're trying to access
        const moviesUrl = `${API_URL}/movies/`;
        console.log('Attempting to fetch movies from:', moviesUrl);
        
        // Fetch all movies for the main display
        const moviesResponse = await axios.get(moviesUrl, config);
        console.log('Full Movies Response:', moviesResponse);
        console.log('Movies Data:', moviesResponse.data);
        
        // Extract movies from the response with defensive checking
        const moviesData = moviesResponse.data?.movies || [];
        console.log('Extracted Movies:', moviesData);
        
        if (!isMounted) return;
        
        // Only update state if we have valid data
        if (Array.isArray(moviesData) && moviesData.length > 0) {
          setMovies(moviesData);
          setFilteredMovies(moviesData);
          
          // Set trending movies (use the first 20 movies)
          setMostWatchedMovies(moviesData.slice(0, 20));
          
          // Process genres and create genre-based movie lists
          const genreMoviesMap = {};
          moviesData.forEach(movie => {
            if (movie.genres) {
              let movieGenres = [];
              
              if (typeof movie.genres === 'string') {
                try {
                  let cleanGenres = movie.genres.trim();
                  if (cleanGenres.startsWith('[') && cleanGenres.endsWith(']')) {
                    const parsedGenres = JSON.parse(cleanGenres.replace(/'/g, '"'));
                    movieGenres = parsedGenres.map(g => g.name || genreMap[g.id] || g.id);
                  } else if (cleanGenres.includes("'id':")) {
                    const idMatch = cleanGenres.match(/'id':\s*(\d+)/);
                    if (idMatch) {
                      const id = idMatch[1];
                      movieGenres = [genreMap[id] || id];
                    }
                  } else {
                    movieGenres = cleanGenres.split(',').map(g => g.trim()).filter(g => g);
                  }
                } catch (error) {
                  console.error('Error parsing genres:', error);
                }
              } else if (Array.isArray(movie.genres)) {
                movieGenres = movie.genres.map(g => {
                  if (g && typeof g === 'object') {
                    return g.name || genreMap[g.id] || g.id;
                  }
                  return g;
                });
              }
              
              movieGenres.forEach(genre => {
                if (!genreMoviesMap[genre]) {
                  genreMoviesMap[genre] = [];
                }
                genreMoviesMap[genre].push(movie);
              });
            }
          });
          
          setGenreBasedMovies(genreMoviesMap);
          
          // Extract and set unique genres
          const uniqueGenres = Object.keys(genreMoviesMap).sort();
          setGenres(uniqueGenres);
          
          // Extract languages and years
          const extractedLanguages = new Set();
          const extractedYears = new Set();
          
          moviesData.forEach(movie => {
            if (movie.original_language) {
              extractedLanguages.add(movie.original_language);
            }
            if (movie.release_date) {
              try {
                const year = new Date(movie.release_date).getFullYear();
                if (!isNaN(year)) extractedYears.add(year);
              } catch (e) {
                console.error('Error parsing date:', movie.release_date);
              }
            }
          });
          
          setLanguages(Array.from(extractedLanguages).sort());
          setYears(Array.from(extractedYears).sort((a, b) => b - a));
        } else {
          // If no movies are available, show a more specific error message
          if (moviesResponse.status === 200) {
            setError('No movies found in the database. Please add some movies first.');
          } else {
            setError(`Error: ${moviesResponse.status} - ${moviesResponse.statusText}`);
          }
        }
        
        // Only fetch user-specific data if logged in
        if (token && isMounted) {
          try {
            // Log the recommendations URL
            const recommendedUrl = `${API_URL}/movies/recommended/`;
            console.log('Attempting to fetch recommendations from:', recommendedUrl);
            
            // Fetch recommended movies
            const recommendedResponse = await axios.get(recommendedUrl, config);
            console.log('Full Recommendations Response:', recommendedResponse);
            console.log('Recommendations Data:', recommendedResponse.data);
            
            if (isMounted) {
              setRecommendedMovies(recommendedResponse.data?.recommended_movies || []);
            }
          } catch (err) {
            console.error('Error fetching user-specific data:', err);
            if (isMounted) {
              setRecommendedMovies([]);
            }
          }
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        if (isMounted) {
          if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            setError(`Error: ${err.response.status} - ${err.response.data?.detail || err.response.statusText}`);
          } else if (err.request) {
            // The request was made but no response was received
            setError('No response from server. Please check if the server is running.');
          } else {
            // Something happened in setting up the request that triggered an Error
            setError(`Error: ${err.message}`);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchAllData();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  useEffect(() => {
    // Check for search term in URL
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get('search') || '';
    if (urlSearch && urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
      handleSearchFromURL(urlSearch);
    }
    // eslint-disable-next-line
  }, [location.search]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    
    // Clear search results if search input is empty
    if (!e.target.value.trim()) {
      setFilteredMovies(movies);
    }
  };
  
  // Handle email input for newsletter
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  
  // Handle Get Started button in hero section
  const handleGetStarted = (e) => {
    e.preventDefault();
    // Scroll to the genre section
    document.querySelector('.genre-based-section').scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add subscription logic here
    console.log('Subscribing with email:', email);
    setSubscribeMessage('Thanks for subscribing!');
    setTimeout(() => setSubscribeMessage(''), 3000);
    setEmail('');
  };
  
  // Helper function to safely extract year from date string
  const extractYear = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).getFullYear().toString();
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return 'N/A';
    }
  };
  
  // Helper function to safely format ratings
  const formatRating = (rating) => {
    if (rating === undefined || rating === null) return '?';
    try {
      return typeof rating === 'number' ? rating.toFixed(1) : '?';
    } catch (error) {
      return '?';
    }
  };
  
  // Helper function to get proper poster URL
  const getGenrePosterUrl = (path) => {
    if (!path) return 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';
    if (path.startsWith('http')) return path;
    // Ensure the path starts with a forward slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `https://image.tmdb.org/t/p/w200${cleanPath}`;
  };
  
  // Helper function to get proper poster URL for movie cards
  const getPosterUrl = (path) => {
    if (!path) return 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';
    if (path.startsWith('http')) return path;
    // Ensure the path starts with a forward slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `https://image.tmdb.org/t/p/w500${cleanPath}`;
  };
  
  // Handle genre selection
  const handleGenreSelect = (genre) => {
    console.log('Selected genre:', genre);
    setSelectedGenreForSuggestions(genre);
    
    if (genre === 'All Genres') {
      console.log('Showing all movies');
      setFilteredMovies(movies);
      return;
    }

    console.log('Filtering movies for genre:', genre);
    const filtered = movies.filter(movie => {
      if (!movie.genres) {
        return false;
      }

      try {
        let movieGenres = [];
        
        if (typeof movie.genres === 'string') {
          const cleanGenres = movie.genres.trim();
          
          // Skip empty arrays
          if (cleanGenres === '[]') {
            return false;
          }
          
          // Try to parse JSON format
          if (cleanGenres.startsWith('[') && cleanGenres.endsWith(']')) {
            const parsedGenres = JSON.parse(cleanGenres.replace(/'/g, '"'));
            movieGenres = parsedGenres.map(g => {
              if (g && typeof g === 'object') {
                return g.name || genreMap[g.id] || g.id;
              }
              return g;
            });
          }
          // Handle ID format
          else if (cleanGenres.includes("'id':")) {
            const idMatch = cleanGenres.match(/'id':\s*(\d+)/);
            if (idMatch) {
              const id = idMatch[1];
              movieGenres = [genreMap[id] || id];
            }
          }
        } else if (Array.isArray(movie.genres)) {
          movieGenres = movie.genres.map(g => {
            if (g && typeof g === 'object') {
              return g.name || genreMap[g.id] || g.id;
            }
            return g;
          });
        }

        // Clean up the genres
        movieGenres = movieGenres.filter(g => 
          g && 
          g !== '[]' && 
          g !== 'null' && 
          g !== 'undefined' && 
          g !== '' &&
          !g.match(/^\d+$/)
        );

        console.log('Movie:', movie.title, 'Genres:', movieGenres);
        return movieGenres.includes(genre);
      } catch (error) {
        console.error('Error processing genres for movie:', movie.title, error);
        return false;
      }
    });

    console.log('Found movies for genre', genre, ':', filtered.length);
    setFilteredMovies(filtered);
  };

  // Update the genre selection handler
  const handleGenreForSuggestionsChange = (genre) => {
    console.log('Genre button clicked:', genre);
    handleGenreSelect(genre);
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return;
    }
    
    try {
      setSearchLoading(true);
      setError(null);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('accessToken');
      
      // Prepare headers
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      // Perform search
      const response = await axios.get(
        `${API_URL}/movies/?search=${encodeURIComponent(searchTerm)}`,
        config
      );
      
      console.log('Search Response:', response.data);
      setFilteredMovies(response.data?.movies || []);
      
      // Scroll to search results
      setTimeout(() => {
        const searchResults = document.getElementById('search-results-section');
        if (searchResults) {
          searchResults.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (err) {
      console.error('Error searching:', err);
      if (err.response) {
        console.error('Error Response:', err.response.data);
        setError(`Error: ${err.response.data.detail || 'Something went wrong'}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your internet connection.');
      } else {
        console.error('Error message:', err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search input on enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Use useMemo to prevent unnecessary re-renders of genre-based content
  const filteredGenreMovies = useMemo(() => {
    if (!genreBasedMovies) return {};
    
    // Create a filtered copy to ensure only valid movies are included
    const filtered = {};
    
    Object.entries(genreBasedMovies).forEach(([genre, movies]) => {
      if (!Array.isArray(movies)) {
        filtered[genre] = [];
        return;
      }
      
      // Only include movies with required fields
      filtered[genre] = movies.filter(movie => 
        movie && movie.id && movie.title
      );
    });
    
    return filtered;
  }, [genreBasedMovies]);

  // Movie card component with improved image loading
  const GenreMovieCard = React.memo(({ movie, genre }) => {
    const movieId = movie?.id || 'unknown';
    const title = movie?.title || 'Unknown Title';
    const posterPath = movie?.poster_path || null;
    const voteAverage = movie?.vote_average;
    const releaseDate = movie?.release_date;
    
    // Add state to track image loading status
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    // Preload the image
    useEffect(() => {
      if (posterPath) {
        const img = new Image();
        img.src = getGenrePosterUrl(posterPath);
        img.onload = () => setImageLoaded(true);
        img.onerror = () => setImageError(true);
      }
    }, [posterPath]);
    
    return (
      <Link 
        key={`genre-movie-${genre}-${movieId}`} 
        to={`/movie/${movieId}`} 
        className="genre-movie-card"
      >
        <div className="genre-movie-poster">
          {/* Show a placeholder while the image is loading */}
          {!imageLoaded && !imageError && (
            <div className="poster-placeholder">
              <div className="loader-small"></div>
            </div>
          )}
          <img 
            src={getGenrePosterUrl(posterPath)} 
            alt={title} 
            loading="lazy"
            style={{ display: imageLoaded ? 'block' : 'none' }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => { 
              setImageError(true);
              setImageLoaded(true);
              e.target.onerror = null; 
              e.target.src = 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'; 
            }}
          />
          {/* Show a clear error state */}
          {imageError && (
            <div className="poster-error-overlay">
              <span>No Image</span>
            </div>
          )}
          <div className="genre-movie-rating">{formatRating(voteAverage)}</div>
        </div>
        <h4 className="genre-movie-title">{title}</h4>
        <p className="genre-movie-year">{extractYear(releaseDate)}</p>
      </Link>
    );
  });

  // Fetch most watched movies
  useEffect(() => {
    const determineMostWatched = () => {
      if (!movies || movies.length === 0) return;
      
      // Sort movies by popularity or view count to determine most watched
      const sortedMovies = [...movies].sort((a, b) => {
        // First try to sort by view_count if available
        if (a.view_count !== undefined && b.view_count !== undefined) {
          return b.view_count - a.view_count;
        }
        // Then try to sort by popularity
        if (a.popularity !== undefined && b.popularity !== undefined) {
          return b.popularity - a.popularity;
        }
        // Finally try to sort by vote_average
        if (a.vote_average !== undefined && b.vote_average !== undefined) {
          return b.vote_average - a.vote_average;
        }
        return 0;
      });

      // Take the top 20 movies
      setMostWatchedMovies(sortedMovies.slice(0, 20));
    };

    const fetchMostWatched = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};

        // Use trending endpoint as primary source since most-watched doesn't exist
        const response = await axios.get(`${API_URL}/movies/trending/`, config);
        console.log('Trending movies response:', response.data);
        
        if (response.data && response.data.movies) {
          setMostWatchedMovies(response.data.movies);
        } else if (response.data && Array.isArray(response.data)) {
          setMostWatchedMovies(response.data);
        } else {
          // If no data from trending, use a subset of all movies as fallback
          if (movies.length > 0) {
            setMostWatchedMovies(movies.slice(0, 20));
          }
        }
      } catch (error) {
        console.error('Error fetching trending movies:', error);
        // If trending endpoint fails, use a subset of all movies as fallback
        if (movies.length > 0) {
          setMostWatchedMovies(movies.slice(0, 20));
        }
      }
    };

    if (movies.length > 0) {
      fetchMostWatched();
    }
  }, [movies, API_URL]);

  // Helper to trigger search from URL
  const handleSearchFromURL = async (term) => {
    if (!term.trim()) return;
    try {
      setSearchLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(
        `${API_URL}/movies/?search=${encodeURIComponent(term)}`,
        config
      );
      setFilteredMovies(response.data?.movies || []);
    } catch (err) {
      setError('Error searching movies.');
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading && (!movies || !movies.length)) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading amazing movies for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p className="error-message">{error}</p>
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
          {error.includes('session has expired') && (
            <Link to="/login" className="login-link">
              Log In Again
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Ensure movies is an array before mapping
  if (!Array.isArray(filteredMovies) && !loading) {
    return <h2>No movies available</h2>;
  }

  // Horizontal movie list component
  const MovieRow = ({ title, movies, className, emptyMessage }) => {
    if (!movies || movies.length === 0) {
      return (
        <div className={`movie-row ${className || ''}`}>
          <h2>{title}</h2>
          <p className="empty-message">{emptyMessage || 'No movies available right now.'}</p>
        </div>
      );
    }
    
    return (
      <div className={`movie-row ${className || ''}`}>
        <h2>{title}</h2>
        <div className="horizontal-scroll">
          {movies.map(movie => (
            <Link 
              key={movie.id} 
              to={`/movie/${movie.id}`} 
              className="movie-card-horizontal"
            >
              <div className="poster-container">
                <img 
                  src={getPosterUrl(movie.poster_path)} 
                  alt={movie.title} 
                  className="movie-poster-horizontal" 
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'; 
                  }}
                />
                <div className="movie-overlay">
                  <span className="view-details">View Details</span>
                </div>
              </div>
              <h3>{movie.title}</h3>
              <div className="movie-info">
                <span className="movie-rating">⭐ {movie.vote_average?.toFixed(1) || "N/A"}</span>
                <span className="movie-year">{movie.release_date?.substring(0, 4) || "N/A"}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="home-container">
      <div className="home">
        {/* Hero Banner Section */}
        <div className="hero-banner">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Discover Your Next Favorite Movie</h1>
            <h3 className="hero-subtitle">Personalized recommendations, trending hits, and more</h3>
          </div>
        </div>
        
        {/* Search Results Section - display when search is active */}
        {searchTerm && (
          <div id="search-results-section" className="search-results-section">
            <h2 className="section-title">Search Results for "{searchTerm}"</h2>
            {searchLoading ? (
              <div className="loading-container">
                <div className="loader"></div>
                <p>Searching movies...</p>
              </div>
            ) : filteredMovies && filteredMovies.length > 0 ? (
              <div className="movie-grid">
                <Link key={filteredMovies[0].id} to={`/movie/${filteredMovies[0].id}`} className="movie-card-link">
                  <div className="movie-card">
                    <div className="poster-container">
                      <img 
                        src={getPosterUrl(filteredMovies[0].poster_path)} 
                        alt={filteredMovies[0].title} 
                        className="movie-poster" 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'; }}
                      />
                      <div className="movie-overlay">
                        <div className="movie-details">
                          <h4>{filteredMovies[0].title}</h4>
                          {filteredMovies[0].overview && (
                            <div className="movie-overview">{filteredMovies[0].overview.substring(0, 100)}...</div>
                          )}
                          <span className="view-details">View Details</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="movie-title">{filteredMovies[0].title}</h3>
                    <div className="movie-meta">
                      <span className="movie-year">{filteredMovies[0].release_date?.substring(0, 4) || "N/A"}</span>
                      <span className="movie-rating">⭐ {filteredMovies[0].vote_average?.toFixed(1) || "N/A"}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="no-results">
                <h3>No movies found matching "{searchTerm}"</h3>
                <p>Try adjusting your search terms or explore our other categories below.</p>
                <button className="reset-button" onClick={() => {
                  setSearchTerm('');
                  fetchAllData(); // You'll need to define this function outside the useEffect
                }}>Clear Search</button>
              </div>
            )}
          </div>
        )}
        
        {/* Featured Sections */}
        <div className="featured-sections">
          {recommendedMovies && recommendedMovies.length > 0 && (
            <MovieRow 
              title="Recommended For You" 
              movies={recommendedMovies} 
              className="recommended-section" 
              emptyMessage="Watch and rate more movies to get personalized recommendations!"
            />
          )}
          
          <MovieRow 
            title="Trending Movies" 
            movies={mostWatchedMovies} 
            className="most-watched-section" 
            emptyMessage="No trending movies available right now."
          />
        </div>
        
        {/* Genre-based section with error handling */}
        <section className="genre-based-section">
          <h2 className="section-title">Explore Movies by Genre</h2>
          
          <div className="genre-selector">
            {genres.map(genre => (
              <button
                key={genre}
                className={`genre-btn ${selectedGenreForSuggestions === genre ? 'active' : ''}`}
                onClick={() => handleGenreForSuggestionsChange(genre)}
              >
                {genre}
              </button>
            ))}
            <button
              className={`genre-btn ${!selectedGenreForSuggestions ? 'active' : ''}`}
              onClick={() => handleGenreForSuggestionsChange('All Genres')}
            >
              All Genres
            </button>
          </div>

          {selectedGenreForSuggestions ? (
            <div className="genre-movies">
              <h3>{selectedGenreForSuggestions} Movies</h3>
              {filteredMovies.length > 0 ? (
                <div className="movie-grid">
                  {filteredMovies.map(movie => (
                    <Link 
                      key={movie.id} 
                      to={`/movie/${movie.id}`} 
                      className="movie-card"
                    >
                      <img 
                        src={getPosterUrl(movie.poster_path)} 
                        alt={movie.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';
                        }}
                      />
                      <h4>{movie.title}</h4>
                      <p>{movie.release_date?.split('-')[0]}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="no-movies">No {selectedGenreForSuggestions} movies found.</p>
              )}
            </div>
          ) : (
            <div className="all-genres-movies">
              {genres.map(genre => (
                <div key={genre} className="genre-section">
                  <h3>{genre} Movies</h3>
                  <div className="movie-grid">
                    {movies
                      .filter(movie => {
                        try {
                          if (!movie.genres) return false;
                          let movieGenres = [];
                          if (typeof movie.genres === 'string') {
                            const cleanGenres = movie.genres.trim();
                            if (cleanGenres === '[]' || cleanGenres === '"[]"' || cleanGenres === '[] Movies') return false;
                            if (cleanGenres.startsWith('[') && cleanGenres.endsWith(']')) {
                              const parsedGenres = JSON.parse(cleanGenres.replace(/'/g, '"'));
                              movieGenres = parsedGenres.map(g => g.name || genreMap[g.id] || g.id);
                            } else if (cleanGenres.includes("'id':")) {
                              const idMatch = cleanGenres.match(/'id':\s*(\d+)/);
                              if (idMatch) {
                                const id = idMatch[1];
                                movieGenres = [genreMap[id] || id];
                              }
                            }
                          } else if (Array.isArray(movie.genres)) {
                            movieGenres = movie.genres.map(g => {
                              if (g && typeof g === 'object') {
                                return g.name || genreMap[g.id] || g.id;
                              }
                              return g;
                            });
                          }
                          return movieGenres.includes(genre);
                        } catch (error) {
                          return false;
                        }
                      })
                      .slice(0, 6)
                      .map(movie => (
                        <Link 
                          key={movie.id} 
                          to={`/movie/${movie.id}`} 
                          className="movie-card"
                        >
                          <img 
                            src={getPosterUrl(movie.poster_path)} 
                            alt={movie.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';
                            }}
                          />
                          <h4>{movie.title}</h4>
                          <p>{movie.release_date?.split('-')[0]}</p>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Home;