# MovieBuddy

MovieBuddy is a movie recommendation application that helps users discover new movies based on their preferences and viewing history.

## Project Overview

This application consists of:
- A Django REST Framework backend with a recommendation engine built using scikit-learn
- A modern React frontend with Vite

## Features

- Enhanced movie details page with interactive movie posters
- Immersive UI with a tabbed interface
- Review system with user reviews and interactive ratings
- Dynamic navbar with scroll effects
- Responsive design for all device sizes

## Getting Started

### Backend Setup

```bash
cd backend
python -m pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Admin Access

Default admin credentials:
- Username: admin1
- Email: admin@gmail.com
- Password: (Set during initial setup)

## Architecture

- **Backend**: Django REST Framework with SQLite database
- **Frontend**: React with modern UI components
- **Recommendation Engine**: Built with scikit-learn

## Project Structure

- `/backend`: Django server and recommendation engine
- `/frontend`: React application
- `/dataset`: Movie dataset files

## License

This project is licensed under the MIT License - see the LICENSE file for details.
