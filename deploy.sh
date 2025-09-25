#!/bin/bash

# Tej IT Site Deployment Script
# This script automates the deployment process for production

set -e  # Exit on any error

# Configuration
REPO_URL="https://github.com/TejGroup9955/Tej-IT-Site.git"
PROJECT_DIR="/opt/tej-it-site"
COMPOSE_FILE="docker-compose.prod.yml"
FRONTEND_URL="http://10.10.50.93:3001"
BACKEND_URL="http://10.10.50.93:5001"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root or with sudo
check_permissions() {
    if [[ $EUID -eq 0 ]]; then
        warning "Running as root. Consider using a dedicated deployment user."
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    # Check curl for health checks
    if ! command -v curl &> /dev/null; then
        error "curl is not installed. Please install curl first."
        exit 1
    fi
    
    success "All prerequisites are installed"
}

# Create project directory
setup_project_directory() {
    log "Setting up project directory..."
    
    if [ ! -d "$PROJECT_DIR" ]; then
        sudo mkdir -p "$PROJECT_DIR"
        sudo chown $USER:$USER "$PROJECT_DIR"
        log "Created project directory: $PROJECT_DIR"
    fi
}

# Clone or update repository
update_repository() {
    log "Updating repository..."
    
    if [ -d "$PROJECT_DIR/.git" ]; then
        log "Repository exists, pulling latest changes..."
        cd "$PROJECT_DIR"
        git fetch origin
        git reset --hard origin/main
        success "Repository updated to latest version"
    else
        log "Cloning repository..."
        git clone "$REPO_URL" "$PROJECT_DIR"
        cd "$PROJECT_DIR"
        success "Repository cloned successfully"
    fi
}

# Stop existing containers
stop_existing_containers() {
    log "Stopping existing containers..."
    cd "$PROJECT_DIR"
    
    if [ -f "$COMPOSE_FILE" ]; then
        docker-compose -f "$COMPOSE_FILE" down --remove-orphans || true
        success "Existing containers stopped"
    else
        warning "No existing compose file found"
    fi
}

# Build and start containers
build_and_start() {
    log "Building and starting containers..."
    cd "$PROJECT_DIR"
    
    # Build images
    log "Building Docker images..."
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    
    # Start services
    log "Starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    success "Containers started successfully"
}

# Wait for services to be ready
wait_for_services() {
    log "Waiting for services to be ready..."
    
    # Wait for backend
    log "Checking backend health..."
    for i in {1..30}; do
        if curl -f "$BACKEND_URL/health" &> /dev/null; then
            success "Backend is healthy"
            break
        fi
        if [ $i -eq 30 ]; then
            error "Backend failed to start within 5 minutes"
            exit 1
        fi
        sleep 10
    done
    
    # Wait for frontend
    log "Checking frontend health..."
    for i in {1..30}; do
        if curl -f "$FRONTEND_URL" &> /dev/null; then
            success "Frontend is healthy"
            break
        fi
        if [ $i -eq 30 ]; then
            error "Frontend failed to start within 5 minutes"
            exit 1
        fi
        sleep 10
    done
}

# Run smoke tests
run_smoke_tests() {
    log "Running smoke tests..."
    
    # Test frontend homepage
    if curl -f -s "$FRONTEND_URL" > /dev/null; then
        success "✅ Frontend homepage accessible"
    else
        error "❌ Frontend homepage failed"
        exit 1
    fi
    
    # Test backend health endpoint
    if curl -f -s "$BACKEND_URL/health" > /dev/null; then
        success "✅ Backend health check passed"
    else
        error "❌ Backend health check failed"
        exit 1
    fi
    
    # Test backend API endpoints (if they exist)
    if curl -f -s "$BACKEND_URL/api/testimonials" > /dev/null; then
        success "✅ Backend API endpoints accessible"
    else
        warning "⚠️ Some backend API endpoints may not be accessible"
    fi
    
    success "All smoke tests passed!"
}

# Cleanup old images
cleanup() {
    log "Cleaning up old Docker images..."
    docker image prune -f
    docker system prune -f --volumes
    success "Cleanup completed"
}

# Show deployment status
show_status() {
    log "Deployment Status:"
    echo "===================="
    echo "🌐 Frontend: $FRONTEND_URL"
    echo "🔧 Backend:  $BACKEND_URL"
    echo "📊 Containers:"
    docker-compose -f "$PROJECT_DIR/$COMPOSE_FILE" ps
    echo "===================="
}

# Rollback function
rollback() {
    error "Deployment failed. Attempting rollback..."
    cd "$PROJECT_DIR"
    
    # Stop current containers
    docker-compose -f "$COMPOSE_FILE" down || true
    
    # Try to start previous version (if backup exists)
    if docker images | grep -q "tej-frontend:backup"; then
        log "Restoring from backup images..."
        docker tag tej-frontend:backup tej-frontend:latest
        docker tag tej-backend:backup tej-backend:latest
        docker-compose -f "$COMPOSE_FILE" up -d
        warning "Rollback completed. Please check the application."
    else
        error "No backup images found. Manual intervention required."
    fi
}

# Main deployment function
main() {
    log "🚀 Starting Tej IT Site deployment..."
    
    # Trap errors for rollback
    trap rollback ERR
    
    check_permissions
    check_prerequisites
    setup_project_directory
    update_repository
    
    # Create backup of current images
    if docker images | grep -q "tej-frontend"; then
        log "Creating backup of current images..."
        docker tag tej-frontend:latest tej-frontend:backup || true
        docker tag tej-backend:latest tej-backend:backup || true
    fi
    
    stop_existing_containers
    build_and_start
    wait_for_services
    run_smoke_tests
    cleanup
    show_status
    
    success "🎉 Deployment completed successfully!"
    echo ""
    echo "Access your application:"
    echo "Frontend: $FRONTEND_URL"
    echo "Backend:  $BACKEND_URL"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "status")
        show_status
        ;;
    "stop")
        log "Stopping all services..."
        cd "$PROJECT_DIR"
        docker-compose -f "$COMPOSE_FILE" down
        success "Services stopped"
        ;;
    "logs")
        cd "$PROJECT_DIR"
        docker-compose -f "$COMPOSE_FILE" logs -f
        ;;
    "rollback")
        rollback
        ;;
    *)
        echo "Usage: $0 {deploy|status|stop|logs|rollback}"
        echo "  deploy   - Deploy the application (default)"
        echo "  status   - Show deployment status"
        echo "  stop     - Stop all services"
        echo "  logs     - Show container logs"
        echo "  rollback - Rollback to previous version"
        exit 1
        ;;
esac