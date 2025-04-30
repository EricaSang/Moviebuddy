from rest_framework import serializers
from .models import Movies, Watchlist, UserRating, OTP
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class MovieSerializers(serializers.ModelSerializer):
    class Meta:
        model = Movies
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Validate email format
        if not attrs['email']:
            raise serializers.ValidationError({"email": "Email is required."})
        
        # Validate username
        if not attrs['username']:
            raise serializers.ValidationError({"username": "Username is required."})
        
        return attrs

    def create(self, validated_data):
        # Remove password2 from validated data
        validated_data.pop('password2')
        
        # Create user with validated data
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class WatchlistSerializer(serializers.ModelSerializer):
    movie_details = MovieSerializers(source='movie', read_only=True)
    
    class Meta:
        model = Watchlist
        fields = ['id', 'user', 'movie', 'movie_details', 'added_at', 'watched']
        read_only_fields = ['user', 'added_at']

class UserRatingSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    
    class Meta:
        model = UserRating
        fields = ['id', 'user', 'username', 'movie', 'movie_title', 'rating', 'review', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ['email', 'code', 'verified', 'created_at', 'expires_at']
        read_only_fields = ['code', 'verified', 'created_at', 'expires_at']
