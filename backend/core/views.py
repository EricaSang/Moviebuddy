from django.shortcuts import render
from .models import Movies, Watchlist, UserRating, User, OTP
from .serializers import MovieSerializers, UserSerializer, RegisterSerializer, LoginSerializer, WatchlistSerializer, UserRatingSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .similar_movies import get_similar_movies
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from django.db.models import Q
import json
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import AllowAny


class MoviesListApi(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Get query parameters
        search_query = request.query_params.get('search', '')
        genre = request.query_params.get('genre', None)
        language = request.query_params.get('language', None)
        year = request.query_params.get('year', None)
        min_rating = request.query_params.get('min_rating', None)
        max_runtime = request.query_params.get('max_runtime', None)
        sort_by = request.query_params.get('sort_by', 'popularity')
        sort_order = request.query_params.get('sort_order', 'desc')
        
        # Start with all movies
        movies = Movies.objects.all()
        
        # Apply search filter if provided
        if search_query:
            movies = movies.filter(
                Q(title__icontains=search_query) |
                Q(original_title__icontains=search_query) |
                Q(overview__icontains=search_query)
            )
        
        # Apply genre filter if provided
        if genre:
            # Filter movies where the genres field contains the specified genre
            movies = movies.filter(genres__contains=genre)
        
        # Filter by release year if provided
        if year:
            movies = movies.filter(release_date__year=year)
        
        # Filter by minimum rating if provided
        if min_rating:
            movies = movies.filter(vote_average__gte=float(min_rating))
        
        # Filter by maximum runtime if provided
        if max_runtime:
            movies = movies.filter(runtime__lte=int(max_runtime))
        
        # Apply sorting
        order_prefix = '-' if sort_order == 'desc' else ''
        valid_sort_fields = ['popularity', 'vote_average', 'release_date', 'title', 'vote_count']
        
        if sort_by in valid_sort_fields:
            movies = movies.order_by(f'{order_prefix}{sort_by}')
        else:
            movies = movies.order_by('-popularity')  # Default sorting
        
        serializer = MovieSerializers(movies, many=True)

        return Response({
            'movies': serializer.data,
        })

class MoviesDetailApi(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, movie_id):
        try:
            movies = Movies.objects.get(id=movie_id)
            serializer = MovieSerializers(movies)
            similar_movies = get_similar_movies(movie_id, 5)
            similar_movies_serializer = MovieSerializers(similar_movies, many=True)

            return Response({
                'movies':serializer.data,
                'similar_movies':similar_movies_serializer.data,
            })
        except Movies.DoesNotExist:
            return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

class RegisterApi(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                # Check if username already exists
                if User.objects.filter(username=serializer.validated_data['username']).exists():
                    return Response({
                        'error': 'Username already exists'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Check if email already exists
                if User.objects.filter(email=serializer.validated_data['email']).exists():
                    return Response({
                        'error': 'Email already exists'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Create the user
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'status': 'success',
                    'message': 'User registered successfully',
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token)
                    }
                }, status=status.HTTP_201_CREATED)
            
            return Response({
                'status': 'error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginApi(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            username = request.data.get('username', None)
            password = request.data.get('password', None)
            
            # Check if fields are provided
            if not username or not password:
                missing_fields = []
                if not username:
                    missing_fields.append('username')
                if not password:
                    missing_fields.append('password')
                
                return Response({
                    'status': 'failed',
                    'message': f"Required fields missing: {', '.join(missing_fields)}"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Try to authenticate user
            user = authenticate(username=username, password=password)
            
            if user is not None:
                # Generate tokens for the user
                refresh = RefreshToken.for_user(user)
                
                # Create response data
                response_data = {
                    'status': 'success',
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    },
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token)
                    }
                }
                
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                # Check if the username exists
                if User.objects.filter(username=username).exists():
                    return Response({
                        'status': 'failed',
                        'message': 'Invalid password. Please try again.'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                else:
                    return Response({
                        'status': 'failed',
                        'message': 'User does not exist. Please register first.'
                    }, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({
                'status': 'failed',
                'message': f'Login failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutApi(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            # Also blacklist any outstanding tokens for this user
            user = request.user
            tokens = OutstandingToken.objects.filter(user_id=user.id)
            for token in tokens:
                _, created = BlacklistedToken.objects.get_or_create(token=token)
                
            return Response({"message": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserDetailsApi(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class TrendingMoviesApi(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Get trending movies based on popularity (higher popularity score)
        trending_movies = Movies.objects.all().order_by('-popularity')[:20]
        serializer = MovieSerializers(trending_movies, many=True)
        return Response({
            'trending_movies': serializer.data,
        })

class TopRatedMoviesApi(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Get top rated movies (higher vote average with minimum vote count)
        top_rated = Movies.objects.filter(vote_count__gte=100).order_by('-vote_average')[:20]
        serializer = MovieSerializers(top_rated, many=True)
        return Response({
            'top_rated_movies': serializer.data,
        })

class GenreMoviesApi(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, genre):
        # Find movies for a specific genre
        movies = Movies.objects.filter(genres__contains=genre).order_by('-popularity')[:20]
        serializer = MovieSerializers(movies, many=True)
        return Response({
            'genre_movies': serializer.data,
            'genre': genre
        })

class RecommendedMoviesApi(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        # This is a simple recommendation based on highest rated movies
        # In a real system, you would implement collaborative filtering or content-based filtering
        recommended = Movies.objects.filter(vote_average__gte=7.5, vote_count__gte=200).order_by('?')[:10]
        serializer = MovieSerializers(recommended, many=True)
        return Response({
            'recommended_movies': serializer.data,
        })

# Watchlist Views
class WatchlistApi(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Get user's watchlist
        watchlist = Watchlist.objects.filter(user=request.user)
        serializer = WatchlistSerializer(watchlist, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        # Add a movie to watchlist
        movie_id = request.data.get('movie_id')
        
        try:
            movie = Movies.objects.get(id=movie_id)
        except Movies.DoesNotExist:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if already in watchlist
        watchlist_entry, created = Watchlist.objects.get_or_create(
            user=request.user,
            movie=movie
        )
        
        if not created:
            return Response({'message': 'Movie already in watchlist'}, status=status.HTTP_200_OK)
        
        serializer = WatchlistSerializer(watchlist_entry)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def delete(self, request, movie_id=None):
        # Remove a movie from watchlist
        if movie_id is None:
            return Response({'error': 'Movie ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            watchlist_entry = Watchlist.objects.get(user=request.user, movie_id=movie_id)
            watchlist_entry.delete()
            return Response({'message': 'Movie removed from watchlist'}, status=status.HTTP_204_NO_CONTENT)
        except Watchlist.DoesNotExist:
            return Response({'error': 'Movie not in watchlist'}, status=status.HTTP_404_NOT_FOUND)
            
class MarkWatchedApi(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request, movie_id):
        try:
            watchlist_entry = Watchlist.objects.get(user=request.user, movie_id=movie_id)
            watchlist_entry.watched = not watchlist_entry.watched
            watchlist_entry.save()
            
            serializer = WatchlistSerializer(watchlist_entry)
            return Response(serializer.data)
        except Watchlist.DoesNotExist:
            return Response({'error': 'Movie not in watchlist'}, status=status.HTTP_404_NOT_FOUND)

# Rating Views
class UserRatingApi(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, movie_id=None):
        if movie_id:
            # Get rating for a specific movie
            try:
                rating = UserRating.objects.get(user=request.user, movie_id=movie_id)
                serializer = UserRatingSerializer(rating)
                return Response(serializer.data)
            except UserRating.DoesNotExist:
                return Response({'message': 'No rating found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Get all user ratings
            ratings = UserRating.objects.filter(user=request.user)
            serializer = UserRatingSerializer(ratings, many=True)
            return Response(serializer.data)
    
    def post(self, request):
        # Add or update a movie rating
        movie_id = request.data.get('movie_id')
        rating_value = request.data.get('rating')
        review = request.data.get('review', '')
        
        if not movie_id or rating_value is None:
            return Response({'error': 'Movie ID and rating are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            movie = Movies.objects.get(id=movie_id)
        except Movies.DoesNotExist:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Update or create the rating
        rating, created = UserRating.objects.update_or_create(
            user=request.user,
            movie=movie,
            defaults={'rating': rating_value, 'review': review}
        )
        
        serializer = UserRatingSerializer(rating)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)
    
    def delete(self, request, movie_id=None):
        # Delete a rating
        if movie_id is None:
            return Response({'error': 'Movie ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            rating = UserRating.objects.get(user=request.user, movie_id=movie_id)
            rating.delete()
            return Response({'message': 'Rating deleted'}, status=status.HTTP_204_NO_CONTENT)
        except UserRating.DoesNotExist:
            return Response({'error': 'Rating not found'}, status=status.HTTP_404_NOT_FOUND)

class MovieRatingsApi(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, movie_id):
        # Get all ratings for a specific movie
        try:
            movie = Movies.objects.get(id=movie_id)
        except Movies.DoesNotExist:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
        
        ratings = UserRating.objects.filter(movie=movie).order_by('-updated_at')
        serializer = UserRatingSerializer(ratings, many=True)
        
        # Calculate average rating
        avg_rating = None
        if ratings.exists():
            avg_rating = sum(r.rating for r in ratings) / ratings.count()
        
        return Response({
            'ratings': serializer.data,
            'count': ratings.count(),
            'average_rating': avg_rating
        })

# OTP Views
class SendOTPApi(APIView):
    """
    API endpoint for sending OTP to user's email during registration
    """
    permission_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user with this email already exists
        if User.objects.filter(email=email).exists():
            return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate OTP
        otp = OTP.generate_otp(email)
        
        # Send OTP to user's email
        try:
            subject = 'Your MovieBuddy Registration OTP'
            message = f'Hello!\n\nYour OTP for MovieBuddy registration is: {otp.code}\n\nThis code will expire in 10 minutes.\n\nThank you,\nMovieBuddy Team'
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [email]
            
            send_mail(subject, message, from_email, recipient_list)
            
            return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Failed to send OTP: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPApi(APIView):
    """
    API endpoint for verifying OTP during registration
    """
    permission_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        
        if not email or not code:
            return Response({'error': 'Email and OTP code are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find the OTP for this email
        try:
            otp = OTP.objects.get(email=email, verified=False)
        except OTP.DoesNotExist:
            return Response({'error': 'No valid OTP found for this email'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if OTP is valid
        if not otp.is_valid():
            return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if OTP code matches
        if otp.code != code:
            return Response({'error': 'Invalid OTP code'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark OTP as verified
        otp.verified = True
        otp.save()
        
        return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)

class ResetPasswordApi(APIView):
    """
    API endpoint for resetting password with verified OTP
    """
    permission_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        password = request.data.get('password')
        
        if not email or not code or not password:
            return Response({'error': 'Email, code and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find the OTP for this email
        try:
            otp = OTP.objects.get(email=email, verified=True)
        except OTP.DoesNotExist:
            return Response({'error': 'No verified OTP found for this email'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find the user with this email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'No user found with this email'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if OTP code matches
        if otp.code != code:
            return Response({'error': 'Invalid OTP code'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(password)
        user.save()
        
        # Delete the OTP after successful password reset
        otp.delete()
        
        return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)

# Create your views here.
