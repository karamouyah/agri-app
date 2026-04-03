# Agri App (Frontend + Django Backend)

This project now includes:

- React + Vite frontend in `src/`
- Django REST API backend in `backend/`

## Backend Setup (Django)

1. Open a terminal in `backend/`.
2. Install dependencies:

```bash
python -m pip install -r requirements.txt
```

3. Create PostgreSQL database (default name in env is `agri_app`):

```bash
psql -U postgres -h 127.0.0.1 -d postgres -c "CREATE DATABASE agri_app;"
```

4. Create environment file:

```bash
copy .env.example .env
```

5. Apply migrations:

```bash
python manage.py migrate
```

6. Seed demo data:

```bash
python manage.py seed_data
```

7. Run server:

```bash
python manage.py runserver
```

API base URL: `http://127.0.0.1:8000/api/`

## Frontend Setup (React)

From the project root:

```bash
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Security Included

The backend was configured with secure defaults:

- JWT authentication (`access` + rotating `refresh` tokens)
- Token blacklist support on refresh rotation
- Role-based access control (farmer, buyer, transporter, ministry)
- Password validation with minimum length and common-password checks
- Rate limiting for anonymous/user traffic and auth endpoints
- Security middleware and hardened headers
- Env-based CORS/CSRF allowed origins
- HTTP-only cookie protections for Django session/csrf values

## Seeded Accounts

`python manage.py seed_data` creates these users:

- ministry@agri.ma / AdminPass123!
- farmer@agri.ma / FarmerPass123!
- buyer@agri.ma / BuyerPass123!
- transporter@agri.ma / TransportPass123!

## Main API Endpoints

- Auth
	- `POST /api/auth/register/`
	- `POST /api/auth/login/`
	- `POST /api/auth/refresh/`
	- `GET /api/auth/me/`

- Admin / Ministry
	- `GET /api/auth/admin/stats/`
	- `GET|PATCH /api/auth/admin/users/`

- Catalog
	- `GET|POST|PATCH|DELETE /api/catalog/products/`
	- `GET|POST|PATCH|DELETE /api/catalog/categories/`
	- `GET|POST|PATCH|DELETE /api/catalog/official-prices/`
	- `GET /api/catalog/filters/`
	- `GET /api/catalog/products/<id>/related/`

- Orders
	- `POST /api/orders/checkout/`
	- `GET /api/orders/mine/`
	- `PATCH /api/orders/<public_id>/status/`
	- `GET /api/orders/invoices/mine/`

- Logistics
	- `GET /api/logistics/requests/`
	- `GET /api/logistics/active/`
	- `GET /api/logistics/missions/<mission_id>/`
	- `POST /api/logistics/missions/<mission_id>/accept/`
	- `POST /api/logistics/missions/<mission_id>/decline/`
	- `PATCH /api/logistics/missions/<mission_id>/status/`

## Notes

- PostgreSQL is used by default (`DB_ENGINE=django.db.backends.postgresql`).
- You can still switch back to SQLite by setting `DB_ENGINE=django.db.backends.sqlite3` and `DB_NAME=db.sqlite3` in `backend/.env`.
- For production, use environment variables from `.env` and disable debug.
