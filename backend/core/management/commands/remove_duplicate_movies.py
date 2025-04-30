from django.core.management.base import BaseCommand
from core.models import Movies
from collections import defaultdict

class Command(BaseCommand):
    help = 'Remove duplicate movies, keeping only the first entry for each unique (title, release_date) pair.'

    def handle(self, *args, **options):
        self.stdout.write('Scanning for duplicate movies...')
        seen = set()
        duplicates = []
        for movie in Movies.objects.all().order_by('id'):
            key = (movie.title.strip().lower(), str(movie.release_date))
            if key in seen:
                duplicates.append(movie.id)
            else:
                seen.add(key)
        if not duplicates:
            self.stdout.write(self.style.SUCCESS('No duplicate movies found.'))
            return
        count = len(duplicates)
        Movies.objects.filter(id__in=duplicates).delete()
        self.stdout.write(self.style.SUCCESS(f'Removed {count} duplicate movies.')) 