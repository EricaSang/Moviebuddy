from django.core.management.base import BaseCommand
from core.models import Movies
import csv
from datetime import datetime
import os

class Command(BaseCommand):
    help = 'Delete all movies and import movies from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file containing movie data')

    def handle(self, *args, **options):
        # Delete all existing movies
        self.stdout.write('Deleting all existing movies...')
        Movies.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully deleted all movies'))

        # Import movies from CSV
        csv_file = options['csv_file']
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'CSV file not found: {csv_file}'))
            return

        self.stdout.write(f'Importing movies from {csv_file}...')
        imported_count = 0
        skipped_count = 0

        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    # Convert date string to date object
                    release_date = None
                    if row.get('release_date'):
                        try:
                            release_date = datetime.strptime(row['release_date'], '%Y-%m-%d').date()
                        except ValueError:
                            pass

                    # Convert numeric fields
                    budget = int(float(row.get('budget', 0))) if row.get('budget') else None
                    revenue = int(float(row.get('revenue', 0))) if row.get('revenue') else None
                    runtime = int(float(row.get('runtime', 0))) if row.get('runtime') else None
                    popularity = float(row.get('popularity', 0)) if row.get('popularity') else 0
                    vote_average = float(row.get('vote_average', 0)) if row.get('vote_average') else 0
                    vote_count = int(float(row.get('vote_count', 0))) if row.get('vote_count') else 0

                    # Create movie object
                    movie = Movies.objects.create(
                        title=row.get('title', ''),
                        original_title=row.get('original_title', ''),
                        overview=row.get('overview', ''),
                        release_date=release_date,
                        budget=budget,
                        revenue=revenue,
                        runtime=runtime,
                        genres=row.get('genres', ''),
                        poster_path=row.get('poster_path', ''),
                        popularity=popularity,
                        vote_average=vote_average,
                        vote_count=vote_count,
                        homepage=row.get('homepage', '')
                    )
                    imported_count += 1
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'Error importing movie {row.get("title", "Unknown")}: {str(e)}'))
                    skipped_count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully imported {imported_count} movies'))
        if skipped_count > 0:
            self.stdout.write(self.style.WARNING(f'Skipped {skipped_count} movies due to errors')) 