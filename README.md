# Agri App

Agri App is a full-stack agriculture marketplace. Farmers publish products, buyers search and place orders, transporters manage delivery missions, and ministry users supervise accounts, catalog data, and national reports.

## Project Structure

- `src/` contains the React and Vite frontend.
- `src/App.jsx` defines the public routes and protected role dashboards.
- `src/components/` contains reusable layout, form, theme, route, and UI components.
- `src/context/` stores shared frontend state such as authentication, theme, and location data.
- `src/services/` contains the API client and frontend service functions that call Django.
- `src/mvc/` keeps the active MVC-style frontend organization: controllers call model/service functions, and views render the screens.
- `backend/` contains the Django REST API.
- `backend/agri_backend/` contains project settings, root URLs, and deployment entry points.
- `backend/apps/users/` handles accounts, roles, profiles, registration, login, and ministry approval.
- `backend/apps/catalog/` handles product categories, official catalog products, and farmer product listings.
- `backend/apps/orders/` handles checkout, buyer orders, invoices, and order status changes.
- `backend/apps/logistics/` handles transporter delivery missions and shipment status.
- `backend/apps/locations/` stores Algerian wilayas and communes used by profiles, checkout, and filters.

## Main User Roles

- Farmer: manages farm profile, product listings, orders, and revenue views.
- Buyer: searches products, views product details, manages cart/checkout, and tracks orders/invoices.
- Transporter: views available delivery requests, accepts missions, and updates delivery progress.
- Ministry: approves users, manages catalog products, reviews reports, and monitors national statistics.

## Main Features

- JWT login and registration with role-based routing.
- Ministry approval workflow for user accounts.
- Product catalog and farmer listing management.
- Buyer search, cart, checkout, order history, and invoices.
- Transporter mission acceptance and delivery status updates.
- Structured location data for wilaya and commune selection.
- PostgreSQL-ready backend with environment-based configuration.

## Frontend to Backend Communication

The frontend uses `src/services/apiClient.js` as the central HTTP client. It builds the API base URL from `VITE_API_BASE_URL`, attaches JWT access tokens from local storage, serializes request bodies as JSON, and converts backend errors into readable messages.

In local development, the default API URL is:

```bash
http://127.0.0.1:8000/api
```

In production, set `VITE_API_BASE_URL` to the deployed Django API URL. When using the Vercel service rewrite in `vercel.json`, the frontend can also reach the backend through `/_/backend/api`.

## Authentication

The backend uses Django REST Framework with Simple JWT. Login returns an access token, a refresh token, and the current user payload. The frontend stores tokens under `agri_auth_tokens` and stores the normalized user under `agri_auth_user`.

Protected React routes use `PrivateRoute` and the role from `AuthContext`. Protected backend endpoints use DRF permission classes such as `IsAuthenticated`, `IsFarmer`, `IsTransporter`, and `IsMinistry`.

## Run the Frontend Locally

From the project root:

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:5173
```

Optional frontend environment variable in `.env`:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Run the Backend Locally

From `backend/`:

```bash
python -m pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

The API runs at:

```bash
http://127.0.0.1:8000/api/
```

## PostgreSQL Setup

The backend is configured for PostgreSQL by default. Create a local database before running migrations:

```bash
psql -U postgres -h 127.0.0.1 -d postgres -c "CREATE DATABASE agri_app;"
```

For local SQLite testing only, set these values in `backend/.env`:

```bash
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

## Important Environment Variables

Frontend:

- `VITE_API_BASE_URL`: public base URL for the Django API.

Backend:

- `DJANGO_SECRET_KEY`: secure Django secret key for production.
- `DJANGO_DEBUG`: use `False` in production.
- `DJANGO_ALLOWED_HOSTS`: comma-separated backend hostnames.
- `CORS_ALLOWED_ORIGINS`: frontend origins allowed to call the API.
- `CSRF_TRUSTED_ORIGINS`: trusted frontend origins for Django security checks.
- `DATABASE_URL`: PostgreSQL connection URL, useful for Neon and hosted databases.
- `DB_ENGINE`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`: manual database settings when `DATABASE_URL` is not used.
- `DB_SSLMODE`: PostgreSQL SSL mode, often `require` for hosted databases.
- `JWT_ACCESS_MINUTES` and `JWT_REFRESH_DAYS`: token lifetime settings.
- `SECURE_SSL_REDIRECT`, `USE_X_FORWARDED_HOST`, and `SECURE_HSTS_SECONDS`: production security settings.

## Deployment Notes

Vercel frontend:

- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_BASE_URL` to the deployed backend API URL unless using the bundled Vercel backend route.

Django backend:

- Set `DJANGO_DEBUG=False`.
- Set `DJANGO_SECRET_KEY` to a strong secret.
- Set `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` for the deployed domains.
- Run migrations before serving traffic.
- Serve static files with the configured WhiteNoise storage.

PostgreSQL / Neon:

- Use `DATABASE_URL` for the hosted database connection.
- Use SSL settings required by the provider, commonly `sslmode=require`.
- Keep database credentials in environment variables, not in source code.

## Seeded Demo Accounts

Running `python manage.py seed_data` creates:

- `ministry@agri.ma` / `AdminPass123!`
- `farmer@agri.ma` / `FarmerPass123!`
- `buyer@agri.ma` / `BuyerPass123!`
- `transporter@agri.ma` / `TransportPass123!`

## Main API Areas

- Auth: `/api/auth/register/`, `/api/auth/login/`, `/api/auth/refresh/`, `/api/auth/me/`
- Admin: `/api/auth/admin/users/`, `/api/auth/admin/stats/`, `/api/auth/admin/reports/`
- Catalog: `/api/catalog/products/`, `/api/catalog/categories/`, `/api/catalog/official-prices/`, `/api/catalog/filters/`
- Orders: `/api/orders/checkout/`, `/api/orders/mine/`, `/api/orders/invoices/mine/`
- Logistics: `/api/logistics/requests/`, `/api/logistics/active/`, `/api/logistics/missions/<mission_id>/`

## Documentation Notes

Source files include comments at the top describing each file responsibility, plus comments or docstrings around major functions, API flows, models, serializers, views, routing, state, validation, and permission logic. These comments are intended to help students and examiners understand the code without changing application behavior.
