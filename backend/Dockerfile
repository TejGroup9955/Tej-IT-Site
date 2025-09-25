# Multi-stage build for Python backend
# Stage 1: Development dependencies and build environment
FROM python:3.11-slim as development

# Set working directory inside the container
WORKDIR /app

# Install system dependencies required for Python packages
# gcc and other build tools are needed for some Python packages
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first to leverage Docker layer caching
# This allows pip install to be cached if requirements.txt hasn't changed
COPY requirements.txt .

# Install Python dependencies
# --no-cache-dir prevents pip from caching packages, reducing image size
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application code
COPY . .

# Expose port 5000 for the Flask/FastAPI application
EXPOSE 5000

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
ENV PYTHONPATH=/app

# Command to run the application in development mode
# Using flask run with host 0.0.0.0 to accept connections from outside container
CMD ["python", "app.py"]

# Stage 2: Production build (smaller, optimized image)
FROM python:3.11-slim as production

# Set working directory
WORKDIR /app

# Install only runtime dependencies (no build tools)
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install production dependencies only
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code (excluding development files)
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

# Expose port 5000
EXPOSE 5000

# Set production environment variables
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

# Use gunicorn for production (more robust than flask dev server)
# Install gunicorn if not in requirements.txt
RUN pip install gunicorn

# Production command using gunicorn with multiple workers
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]