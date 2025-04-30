import os
import csv
import django
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Movies

csv_file_path = './movies_data.csv'



with open(csv_file_path, mode='r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        release_date_str = row['release_date']
        release_date = None
        
        if release_date_str:
            try:
                release_date = datetime.strptime(release_date_str, '%Y-%m-%d').date()
            except ValueError:
                print(f"Invalid date format for movie '{row['title']}'")
                continue  # Skip this row if the date is invalid
        else:
            print(f"Missing release date for movie '{row['title']}'")
            release_date = datetime(1900, 1, 1).date()  # Set default date

        # Skip if title is missing
        if not row['title']:
            print(f"Skipping movie with missing title")
            continue

        movie = Movies(
            title=row['title'],
            original_title=row['original_title'],
            overview=row['overview'],
            release_date=release_date,
            budget=int(row['budget']) if row['budget'] else None,
            revenue=int(row['revenue']) if row['revenue'] else None,
            runtime=int(float(row['runtime'])) if row['runtime'] else None,  
            genres=row['genres'],  
            poster_path=row['poster_path'],
            popularity=float(row['popularity']) if row['popularity'] else 0.0,
            vote_average=float(row['vote_average']) if row['vote_average'] else 0.0,
            vote_count=int(row['vote_count']) if row['vote_count'] else 0,
            homepage=row['homepage'] if row['homepage'] else None
        )
        
        movie.save()
        print(f'Successfully added movie: {movie.title}')

