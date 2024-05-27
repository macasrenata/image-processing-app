# Image Processing Backend

## Setup

1. Create a virtual environment and activate it:

   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install the dependencies:

   ```sh
   pip install -r requirements.txt
   ```

3. Run the FastAPI application:

   ```sh
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

## Docker

1. Build the Docker image:

   ```sh
   docker build -t image-processing-backend .
   ```

2. Run the Docker container:

   ```sh
   docker run -d -p 8000:8000 image-processing-backend
   ```
