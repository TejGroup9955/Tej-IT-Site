# AWS Elastic Beanstalk Deployment Guide

## Overview
This guide explains how to deploy the Tej IT Solutions application (Python backend + Next.js frontend) to AWS Elastic Beanstalk using Docker containers.

## Prerequisites
- AWS CLI installed and configured
- EB CLI installed (`pip install awsebcli`)
- Docker installed locally
- AWS account with appropriate permissions

## Local Development Setup

### 1. Start Local Development
```bash
# Clone the repository
git clone <your-repo-url>
cd Tej-IT-Site

# Start both services with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### 2. Development Workflow
- Code changes in `./backend` and `./frontend` are automatically reflected
- No need to rebuild containers during development
- Use `docker-compose down` to stop services

## Production Deployment to Elastic Beanstalk

### Option 1: Multi-Container Docker Platform

#### Step 1: Prepare Docker Images
```bash
# Build production images
docker build -t tej-backend:latest ./backend --target production
docker build -t tej-frontend:latest ./frontend --target production

# Tag images for ECR (replace with your ECR URLs)
docker tag tej-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/tej-backend:latest
docker tag tej-frontend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/tej-frontend:latest

# Push to ECR
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/tej-backend:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/tej-frontend:latest
```

#### Step 2: Update Dockerrun.aws.json
Update the image URLs in `Dockerrun.aws.json` to point to your ECR repositories.

#### Step 3: Deploy to Elastic Beanstalk
```bash
# Initialize EB application
eb init

# Create environment
eb create tej-production --platform "Multi-container Docker"

# Deploy
eb deploy
```

### Option 2: Single Container Deployment (Alternative)

If you prefer to deploy as separate applications:

#### Backend Deployment
```bash
cd backend
eb init tej-backend
eb create tej-backend-prod --platform "Python 3.11"
eb deploy
```

#### Frontend Deployment
```bash
cd frontend
eb init tej-frontend
eb create tej-frontend-prod --platform "Node.js 18"
eb deploy
```

## Environment Variables for Production

### Backend Environment Variables (set in EB Console)
```
FLASK_ENV=production
DB_HOST=<your-db-host>
DB_PASSWORD=<your-db-password>
SECRET_KEY=<your-secret-key>
FRONTEND_URL=<your-frontend-url>
```

### Frontend Environment Variables
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=<your-backend-url>
```

## Monitoring and Logs

### View Logs
```bash
# View backend logs
eb logs tej-backend-prod

# View frontend logs  
eb logs tej-frontend-prod

# For multi-container setup
eb logs
```

### Health Checks
- Backend health endpoint: `GET /health`
- Frontend health: Next.js built-in health check
- Configure custom health check URLs in EB console if needed

## Scaling and Performance

### Auto Scaling Configuration
```bash
# Configure auto scaling
eb config

# Set in configuration:
# - Min instances: 1
# - Max instances: 10
# - Scaling triggers based on CPU/memory
```

### Load Balancer Configuration
- Application Load Balancer (ALB) recommended
- Configure SSL/TLS certificates
- Set up custom domain names

## Security Best Practices

1. **Environment Variables**: Never hardcode secrets in Dockerfiles
2. **Non-root Users**: Both containers run as non-root users in production
3. **Network Security**: Use VPC and security groups appropriately
4. **Image Scanning**: Enable ECR image scanning for vulnerabilities
5. **Secrets Management**: Use AWS Secrets Manager for sensitive data

## Troubleshooting

### Common Issues
1. **Port Conflicts**: Ensure ports 3000 and 5000 are available
2. **Memory Issues**: Increase instance size if containers are killed
3. **Build Failures**: Check Docker build logs with `docker-compose logs`
4. **Network Issues**: Verify security group settings allow traffic

### Debug Commands
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend

# Execute commands in running containers
docker-compose exec backend bash
docker-compose exec frontend sh

# Rebuild specific service
docker-compose up --build backend
```

## Cost Optimization

1. **Instance Types**: Start with t3.small, scale as needed
2. **Auto Scaling**: Configure to scale down during low traffic
3. **Reserved Instances**: Use for predictable workloads
4. **Spot Instances**: Consider for development environments

## Backup and Disaster Recovery

1. **Database Backups**: Configure RDS automated backups
2. **Code Repository**: Ensure code is backed up in Git
3. **Environment Configuration**: Document all environment variables
4. **Multi-AZ Deployment**: Enable for high availability

## Next Steps

1. Set up CI/CD pipeline with GitHub Actions or AWS CodePipeline
2. Configure monitoring with CloudWatch and alerts
3. Implement blue-green deployments for zero-downtime updates
4. Set up staging environment for testing