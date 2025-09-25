#!/bin/bash

# Build and push Docker images to ECR
# Usage: ./scripts/build-and-push.sh <aws-account-id> <region>

set -e

# Check if required arguments are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <aws-account-id> <region>"
    echo "Example: $0 123456789012 us-east-1"
    exit 1
fi

AWS_ACCOUNT_ID=$1
REGION=$2
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "🚀 Building and pushing Docker images to ECR..."

# Login to ECR
echo "📝 Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Create ECR repositories if they don't exist
echo "📦 Creating ECR repositories..."
aws ecr create-repository --repository-name tej-backend --region $REGION 2>/dev/null || true
aws ecr create-repository --repository-name tej-frontend --region $REGION 2>/dev/null || true

# Build backend image
echo "🔨 Building backend image..."
docker build -t tej-backend:latest ./backend --target production

# Build frontend image
echo "🔨 Building frontend image..."
docker build -t tej-frontend:latest ./frontend --target production

# Tag images for ECR
echo "🏷️  Tagging images..."
docker tag tej-backend:latest $ECR_REGISTRY/tej-backend:latest
docker tag tej-frontend:latest $ECR_REGISTRY/tej-frontend:latest

# Push images to ECR
echo "⬆️  Pushing backend image..."
docker push $ECR_REGISTRY/tej-backend:latest

echo "⬆️  Pushing frontend image..."
docker push $ECR_REGISTRY/tej-frontend:latest

echo "✅ Images successfully pushed to ECR!"
echo "Backend image: $ECR_REGISTRY/tej-backend:latest"
echo "Frontend image: $ECR_REGISTRY/tej-frontend:latest"

# Update Dockerrun.aws.json with new image URLs
echo "📝 Updating Dockerrun.aws.json..."
sed -i.bak "s|tej-backend:latest|$ECR_REGISTRY/tej-backend:latest|g" Dockerrun.aws.json
sed -i.bak "s|tej-frontend:latest|$ECR_REGISTRY/tej-frontend:latest|g" Dockerrun.aws.json

echo "🎉 Ready for Elastic Beanstalk deployment!"
echo "Run: eb deploy"