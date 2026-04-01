# Frontend MVC Structure

This folder introduces an MVC pattern on top of the React app.

## Structure

- `models/`: Data access layer (API/data operations).
  - Delegates to existing backend service adapters in `src/services`.
- `controllers/`: Application logic boundary used by views.
  - Views call controllers, not services directly.
- `views/`: Existing React route pages under `src/pages` now behave as views.

## Data Flow

View (`src/mvc/views/...`) -> Controller (`src/mvc/controllers/...`) -> Model (`src/mvc/models/...`) -> Service/API (`src/services/...`) -> Django backend.

## Backend Side

Backend already follows MVC-like separation by app:

- Models: `backend/apps/*/models.py`
- Controllers (request handlers): `backend/apps/*/views.py`
- Routes: `backend/apps/*/urls.py`
- DTO/validation: `backend/apps/*/serializers.py`
