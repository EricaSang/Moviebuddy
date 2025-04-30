from django.db import models
from django.contrib.auth.models import User
import random
import string
from datetime import datetime, timedelta

# Create your models here.

class Movies(models.Model):
    title = models.CharField(max_length=255)
    original_title = models.CharField(max_length=255, null=True, blank=True)
    overview = models.TextField(null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    budget = models.BigIntegerField(null=True, blank=True)
    revenue = models.BigIntegerField(null=True, blank=True)
    runtime = models.IntegerField(null=True, blank=True)
    genres = models.CharField(max_length=255, null=True, blank=True)
    poster_path = models.CharField(max_length=255, null=True, blank=True)
    popularity = models.FloatField(default=0)
    vote_average = models.FloatField(default=0)
    vote_count = models.IntegerField(default=0)
    homepage = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.title

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    movie = models.ForeignKey(Movies, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    watched = models.BooleanField(default=False)
    watched_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('user', 'movie')
        
    def __str__(self):
        return f"{self.user.username}'s watchlist: {self.movie.title}"

class UserRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    movie = models.ForeignKey(Movies, on_delete=models.CASCADE, related_name='user_ratings')
    rating = models.IntegerField()
    review = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'movie')
        
    def __str__(self):
        return f"{self.user.username}'s rating for {self.movie.title}: {self.rating}"

class OTP(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.email} - {self.code}"
    
    @classmethod
    def generate_otp(cls, email):
        # Generate a 6-digit OTP
        otp_code = ''.join(random.choices(string.digits, k=6))
        
        # Set expiration time (10 minutes from now)
        expiry_time = datetime.now() + timedelta(minutes=10)
        
        # Delete any existing OTPs for this email
        cls.objects.filter(email=email).delete()
        
        # Create new OTP record
        otp = cls.objects.create(
            email=email,
            code=otp_code,
            expires_at=expiry_time
        )
        
        return otp
    
    def is_valid(self):
        now = datetime.now()
        return not self.verified and now < self.expires_at
