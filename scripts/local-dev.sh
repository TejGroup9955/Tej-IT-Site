#!/bin/bash

# Local development setup script
# This script helps set up the development environment

set -e

echo "🚀 Setting up Tej IT Solutions development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install it and try again."
    exit 1
fi

# Create necessary directories if they don't exist
echo "📁 Creating necessary directories..."
mkdir -p backend/static/uploads
mkdir -p frontend/public/uploads

# Set up backend environment file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cat > backend/.env << EOF
# Development environment variables
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=dev-secret-key-change-in-production
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=tej_it_db
FRONTEND_URL=http://localhost:3000
EOF
    echo "⚠️  Please update backend/.env with your actual database credentials"
fi

# Set up frontend environment file if it doesn't exist
if [ ! -f frontend/.env.local ]; then
    echo "📝 Creating frontend .env.local file..."
    cat > frontend/.env.local << EOF
# Development environment variables
NEXT_PUBLIC_API_URL=http://localhost:5000
NODE_ENV=development
EOF
fi

# Build and start the development environment
echo "🔨 Building and starting development containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service health..."
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Backend is running at http://localhost:5000"
else
    echo "⚠️  Backend might still be starting up..."
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running at http://localhost:3000"
else
    echo "⚠️  Frontend might still be starting up..."
fi

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📋 Available commands:"
echo "  docker-compose logs backend   # View backend logs"
echo "  docker-compose logs frontend  # View frontend logs"
echo "  docker-compose down          # Stop all services"
echo "  docker-compose restart       # Restart services"
echo ""
echo "🌐 Access your application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:5000"