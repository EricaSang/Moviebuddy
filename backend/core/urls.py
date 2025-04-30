from django.urls import path
from .views import (
    MoviesListApi, MoviesDetailApi, 
    RegisterApi, LoginApi, LogoutApi, UserDetailsApi, 
    TrendingMoviesApi, TopRatedMoviesApi, GenreMoviesApi, RecommendedMoviesApi,
    WatchlistApi, MarkWatchedApi,
    UserRatingApi, MovieRatingsApi,
    SendOTPApi, VerifyOTPApi, ResetPasswordApi
)

urlpatterns = [
    # Movies
    path('movies/', MoviesListApi.as_view(), name='movies'),
    path('movies/<int:movie_id>/', MoviesDetailApi.as_view(), name='movie-detail'),
    path('movies/trending/', TrendingMoviesApi.as_view(), name='trending-movies'),
    path('movies/top-rated/', TopRatedMoviesApi.as_view(), name='top-rated-movies'),
    path('movies/genre/<str:genre>/', GenreMoviesApi.as_view(), name='genre-movies'),
    path('movies/recommended/', RecommendedMoviesApi.as_view(), name='recommended-movies'),
    
    # User Authentication
    path('register/', RegisterApi.as_view(), name='register'),
    path('login/', LoginApi.as_view(), name='login'),
    path('logout/', LogoutApi.as_view(), name='logout'),
    path('user/', UserDetailsApi.as_view(), name='user-detail'),
    
    # Watchlist
    path('watchlist/', WatchlistApi.as_view(), name='watchlist'),
    path('watchlist/<int:movie_id>/', WatchlistApi.as_view(), name='watchlist-detail'),
    path('watchlist/<int:movie_id>/watched/', MarkWatchedApi.as_view(), name='mark-watched'),
    
    # Ratings
    path('ratings/', UserRatingApi.as_view(), name='ratings'),
    path('ratings/<int:movie_id>/', UserRatingApi.as_view(), name='rating-detail'),
    path('movies/<int:movie_id>/ratings/', MovieRatingsApi.as_view(), name='movie-ratings'),
    
    # OTP
    path('auth/send-otp/', SendOTPApi.as_view(), name='send-otp'),
    path('auth/verify-otp/', VerifyOTPApi.as_view(), name='verify-otp'),
    path('reset-password/', ResetPasswordApi.as_view(), name='reset-password'),
] 