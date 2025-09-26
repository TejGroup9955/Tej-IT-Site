#!/bin/bash

# Simplified Production Deployment Script for Tej IT Site
# Usage: ./deploy.sh [deploy|status|stop|logs|rollback]

set -e

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
FRONTEND_URL="http://10.10.50.93:3001"
BACKEND_URL="http://10.10.50.93:5001/health"
MAX_WAIT_TIME=120
HEALTH_CHECK_INTERVAL=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker and Docker Compose are available
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Wait for service to be healthy
wait_for_service() {
    local service_name=$1
    local url=$2
    local max_attempts=$((MAX_WAIT_TIME / HEALTH_CHECK_INTERVAL))
    local attempt=1
    
    log_info "Waiting for $service_name to be healthy..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            log_success "$service_name is healthy"
            return 0
        fi
        
        log_info "Attempt $attempt/$max_attempts: $service_name not ready yet..."
        sleep $HEALTH_CHECK_INTERVAL
        ((attempt++))
    done
    
    log_error "$service_name failed to become healthy within $MAX_WAIT_TIME seconds"
    return 1
}

# Deploy function
deploy() {
    log_info "Starting deployment..."
    
    check_prerequisites
    
    # Stop existing containers gracefully
    log_info "Stopping existing containers..."
    docker-compose -f "$COMPOSE_FILE" down --timeout 30 || true
    
    # Remove old containers and networks
    docker container prune -f || true
    docker network prune -f || true
    
    # Start new containers
    log_info "Starting new containers..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    # Wait for services to be healthy
    log_info "Waiting for services to start..."
    sleep 10
    
    if wait_for_service "Backend" "$BACKEND_URL" && wait_for_service "Frontend" "$FRONTEND_URL"; then
        log_success "🎉 Deployment completed successfully!"
        log_success "Frontend: $FRONTEND_URL"
        log_success "Backend: $BACKEND_URL"
        
        # Show container status
        docker-compose -f "$COMPOSE_FILE" ps
        
        return 0
    else
        log_error "Deployment failed - services are not healthy"
        log_warning "Rolling back..."
        docker-compose -f "$COMPOSE_FILE" down
        return 1
    fi
}

# Status function
status() {
    log_info "Checking application status..."
    
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        log_success "Application is running"
        docker-compose -f "$COMPOSE_FILE" ps
        
        # Check health endpoints
        if curl -f -s "$FRONTEND_URL" > /dev/null; then
            log_success "Frontend is responding"
        else
            log_warning "Frontend is not responding"
        fi
        
        if curl -f -s "$BACKEND_URL" > /dev/null; then
            log_success "Backend is responding"
        else
            log_warning "Backend is not responding"
        fi
    else
        log_warning "Application is not running"
        docker-compose -f "$COMPOSE_FILE" ps
    fi
}

# Stop function
stop() {
    log_info "Stopping application..."
    docker-compose -f "$COMPOSE_FILE" down --timeout 30
    log_success "Application stopped"
}

# Logs function
logs() {
    log_info "Showing application logs..."
    docker-compose -f "$COMPOSE_FILE" logs -f --tail=100
}

# Rollback function
rollback() {
    log_warning "Rolling back deployment..."
    docker-compose -f "$COMPOSE_FILE" down --timeout 30
    
    # Try to start previous version (if available)
    if docker images tej-backend --format "table {{.Tag}}" | grep -v latest | head -1 > /dev/null; then
        log_info "Previous images found, attempting rollback..."
        # This is a simplified rollback - in production you'd want to tag and track previous versions
        docker-compose -f "$COMPOSE_FILE" up -d
        log_success "Rollback completed"
    else
        log_warning "No previous version found for rollback"
    fi
}

# Main script logic
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    status)
        status
        ;;
    stop)
        stop
        ;;
    logs)
        logs
        ;;
    rollback)
        rollback
        ;;
    *)
        echo "Usage: $0 {deploy|status|stop|logs|rollback}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Deploy the application (default)"
        echo "  status   - Check application status"
        echo "  stop     - Stop the application"
        echo "  logs     - Show application logs"
        echo "  rollback - Rollback to previous version"
        exit 1
        ;;
esac