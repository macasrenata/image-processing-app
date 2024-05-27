# Image Processing Application

This repository contains the code for an image processing web application built with React (frontend) and FastAPI (backend). The application allows users to upload images, perform basic image processing operations, and view the results.

## Structure

- `backend/`: FastAPI application for image processing
- `frontend/`: React application for the user interface
- `docker-compose.yml`: Docker Compose configuration for running the application

## Setup

### Using Docker Compose

1. Build and start the application using Docker Compose:

   ```sh
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`

### Without Docker

#### Backend

1. Navigate to the `backend/` directory:

   ```sh
   cd backend
   ```

2. Follow the setup instructions in `backend/README.md`.

#### Frontend

1. Navigate to the `frontend/` directory:

   ```sh
   cd frontend
   ```

2. Follow the setup instructions in `frontend/README.md`.
