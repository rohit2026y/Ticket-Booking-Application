# Ticket Booking Application

A full-stack ticket booking platform built with Modern Tech Stack.

## Tech Stack
-   **Frontend**: Next.js, Tailwind CSS
-   **Backend**: FastAPI, SQLAlchemy, Alembic
-   **Database**: PostgreSQL
-   **Queue/Cache**: Redis, Celery
-   **Deployment**: Docker Compose

## Features
-   User Registration & Login (JWT Auth)
-   Event Listing & Details
-   Seat Booking with Concurrency Handling (Redis Locks)
-   Booking Confirmations (Email Simulation)
-   Booking Confirmations (Email Simulation)
-   Admin Dashboard (Booking Reports)
-   **Enhanced UI/UX**:
    -   High-contrast, readable text
    -   Password visibility toggle
    -   Real-time password validation feedback

## Prerequisites
-   Docker & Docker Compose

## Getting Started

1.  **Clone the repository**
2.  **Start the services**:
    ```bash
    docker-compose up -d --build
    ```
3.  **Run Migrations**:
    ```bash
    docker-compose exec backend alembic upgrade head
    ```
4.  **Seed Data** (Optional):
    ```bash
    docker-compose exec backend python seed_data.py
    ```

## Security Note
-   **Credentials**: The `docker-compose.yml` file contains default credentials for local development. Change them for production.
-   **Secret Key**: The backend uses a default `SECRET_KEY`. Set a strong `SECRET_KEY` in `backend/.env` for production.

## Access the Application
-   **Frontend**: [http://localhost:3000](http://localhost:3000)
-   **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

## Default Admin Credentials
-   **Email**: `admin@example.com`
-   **Password**: `admin123`
