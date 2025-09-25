#!/bin/bash

# Deploy to AWS Elastic Beanstalk script
# Usage: ./scripts/deploy-to-eb.sh <environment-name>

set -e

# Check if environment name is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <environment-name>"
    echo "Example: $0 tej-production"
    exit 1
fi

ENVIRONMENT_NAME=$1

echo "🚀 Deploying to Elastic Beanstalk environment: $ENVIRONMENT_NAME"

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo "❌ EB CLI is not installed. Install it with: pip install awsebcli"
    exit 1
fi

# Check if we're in an EB initialized directory
if [ ! -f .elasticbeanstalk/config.yml ]; then
    echo "❌ This directory is not initialized for Elastic Beanstalk."
    echo "Run 'eb init' first to set up your application."
    exit 1
fi

# Validate Dockerrun.aws.json
echo "📝 Validating Dockerrun.aws.json..."
if [ ! -f Dockerrun.aws.json ]; then
    echo "❌ Dockerrun.aws.json not found. This file is required for multi-container deployment."
    exit 1
fi

# Check if environment exists
if ! eb list | grep -q "$ENVIRONMENT_NAME"; then
    echo "❌ Environment '$ENVIRONMENT_NAME' does not exist."
    echo "Available environments:"
    eb list
    echo ""
    echo "Create a new environment with: eb create $ENVIRONMENT_NAME"
    exit 1
fi

# Deploy to the specified environment
echo "📦 Deploying to $ENVIRONMENT_NAME..."
eb deploy $ENVIRONMENT_NAME

# Check deployment status
echo "🔍 Checking deployment status..."
eb status $ENVIRONMENT_NAME

# Get the application URL
APP_URL=$(eb status $ENVIRONMENT_NAME | grep "CNAME" | awk '{print $2}')

echo ""
echo "🎉 Deployment completed!"
echo "🌐 Application URL: http://$APP_URL"
echo ""
echo "📋 Useful commands:"
echo "  eb logs $ENVIRONMENT_NAME           # View application logs"
echo "  eb ssh $ENVIRONMENT_NAME           # SSH into instance"
echo "  eb config $ENVIRONMENT_NAME        # Edit configuration"
echo "  eb terminate $ENVIRONMENT_NAME     # Terminate environment"