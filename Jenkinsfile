pipeline {
    agent any
    
    environment {
        // Environment variables
        PROJECT_NAME = 'tej-it-site'
        DEPLOY_SERVER = '10.10.50.93'
        DEPLOY_USER = 'deployer'
        FRONTEND_PORT = '3001'
        BACKEND_PORT = '5001'
        
        // Jenkins credentials
        SSH_KEY = credentials('ssh-deployer-key')
        GITHUB_TOKEN = credentials('github-token')
    }
    
    options {
        // Keep builds for 30 days
        buildDiscarder(logRotator(daysToKeepStr: '30', numToKeepStr: '10'))
        
        // Timeout after 30 minutes
        timeout(time: 30, unit: 'MINUTES')
        
        // Disable concurrent builds
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code from GitHub..."
                    
                    // Clean workspace
                    cleanWs()
                    
                    // Checkout code
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            url: 'https://github.com/TejGroup9955/Tej-IT-Site.git',
                            credentialsId: 'github-token'
                        ]]
                    ])
                    
                    // Get commit info
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    
                    echo "✅ Checked out commit: ${env.GIT_COMMIT_SHORT}"
                }
            }
        }
        
        stage('Code Analysis') {
            parallel {
                stage('Scan Endpoints') {
                    steps {
                        script {
                            echo "🔍 Scanning for API endpoints..."
                            
                            // Make scan script executable
                            sh 'chmod +x scripts/scan-endpoints.py'
                            
                            // Run endpoint scanner
                            sh 'python3 scripts/scan-endpoints.py'
                            
                            // Archive endpoints.json
                            archiveArtifacts artifacts: 'endpoints.json', fingerprint: true
                            
                            echo "✅ Endpoint scanning completed"
                        }
                    }
                }
                
                stage('Backend Lint') {
                    steps {
                        script {
                            echo "🔍 Running backend linting..."
                            
                            dir('backend') {
                                // Install dependencies for linting
                                sh '''
                                    python3 -m pip install --user flake8 black
                                    
                                    # Check Python syntax
                                    python3 -m py_compile app.py
                                    
                                    # Run flake8 (ignore line length for now)
                                    python3 -m flake8 --max-line-length=120 --ignore=E501,W503 *.py || true
                                '''
                            }
                            
                            echo "✅ Backend linting completed"
                        }
                    }
                }
                
                stage('Frontend Lint') {
                    steps {
                        script {
                            echo "🔍 Running frontend linting..."
                            
                            dir('frontend') {
                                // Install dependencies and run lint
                                sh '''
                                    npm ci
                                    npm run lint || true
                                    
                                    # Type check
                                    npx tsc --noEmit || true
                                '''
                            }
                            
                            echo "✅ Frontend linting completed"
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    echo "🔨 Building Docker images..."
                    
                    // Build backend image
                    sh '''
                        cd backend
                        docker build -f Dockerfile.prod -t tej-backend:${BUILD_NUMBER} .
                        docker tag tej-backend:${BUILD_NUMBER} tej-backend:latest
                    '''
                    
                    // Build frontend image
                    sh '''
                        cd frontend
                        docker build -f Dockerfile.prod -t tej-frontend:${BUILD_NUMBER} .
                        docker tag tej-frontend:${BUILD_NUMBER} tej-frontend:latest
                    '''
                    
                    echo "✅ Docker images built successfully"
                }
            }
        }
        
        stage('Test Images') {
            steps {
                script {
                    echo "🧪 Testing Docker images..."
                    
                    // Test backend image
                    sh '''
                        # Start backend container for testing
                        docker run -d --name test-backend -p 5002:5001 tej-backend:latest
                        
                        # Wait for startup
                        sleep 30
                        
                        # Test health endpoint
                        curl -f http://localhost:5002/health || exit 1
                        
                        # Cleanup
                        docker stop test-backend
                        docker rm test-backend
                    '''
                    
                    // Test frontend image
                    sh '''
                        # Start frontend container for testing
                        docker run -d --name test-frontend -p 3002:3001 \
                            -e NEXT_PUBLIC_API_URL=http://localhost:5002 \
                            tej-frontend:latest
                        
                        # Wait for startup
                        sleep 45
                        
                        # Test homepage
                        curl -f http://localhost:3002 || exit 1
                        
                        # Cleanup
                        docker stop test-frontend
                        docker rm test-frontend
                    '''
                    
                    echo "✅ Image testing completed"
                }
            }
        }
        
        stage('Deploy to Server') {
            steps {
                script {
                    echo "🚀 Deploying to production server..."
                    
                    // Save images as tar files
                    sh '''
                        docker save tej-backend:latest | gzip > tej-backend.tar.gz
                        docker save tej-frontend:latest | gzip > tej-frontend.tar.gz
                    '''
                    
                    // Transfer files to server
                    sshagent(['ssh-deployer-key']) {
                        sh '''
                            # Create remote directory
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} "mkdir -p /opt/tej-it-site"
                            
                            # Transfer Docker images
                            scp -o StrictHostKeyChecking=no tej-backend.tar.gz ${DEPLOY_USER}@${DEPLOY_SERVER}:/opt/tej-it-site/
                            scp -o StrictHostKeyChecking=no tej-frontend.tar.gz ${DEPLOY_USER}@${DEPLOY_SERVER}:/opt/tej-it-site/
                            
                            # Transfer compose file and deploy script
                            scp -o StrictHostKeyChecking=no docker-compose.prod.yml ${DEPLOY_USER}@${DEPLOY_SERVER}:/opt/tej-it-site/
                            scp -o StrictHostKeyChecking=no deploy.sh ${DEPLOY_USER}@${DEPLOY_SERVER}:/opt/tej-it-site/
                            
                            # Load images and run deployment
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} "
                                cd /opt/tej-it-site
                                
                                # Load Docker images
                                docker load < tej-backend.tar.gz
                                docker load < tej-frontend.tar.gz
                                
                                # Make deploy script executable
                                chmod +x deploy.sh
                                
                                # Run deployment
                                ./deploy.sh deploy
                            "
                        '''
                    }
                    
                    echo "✅ Deployment completed"
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    echo "🔍 Verifying deployment..."
                    
                    // Wait a bit for services to stabilize
                    sleep 30
                    
                    // Verify frontend
                    def frontendStatus = sh(
                        script: "curl -f -s -o /dev/null -w '%{http_code}' ${FRONTEND_URL}",
                        returnStdout: true
                    ).trim()
                    
                    if (frontendStatus == '200') {
                        success "✅ Frontend is accessible (HTTP ${frontendStatus})"
                    } else {
                        error "❌ Frontend check failed (HTTP ${frontendStatus})"
                        currentBuild.result = 'FAILURE'
                    }
                    
                    // Verify backend
                    def backendStatus = sh(
                        script: "curl -f -s -o /dev/null -w '%{http_code}' ${BACKEND_URL}/health",
                        returnStdout: true
                    ).trim()
                    
                    if (backendStatus == '200') {
                        success "✅ Backend is accessible (HTTP ${backendStatus})"
                    } else {
                        error "❌ Backend check failed (HTTP ${backendStatus})"
                        currentBuild.result = 'FAILURE'
                    }
                    
                    // Test API endpoint
                    def apiStatus = sh(
                        script: "curl -f -s -o /dev/null -w '%{http_code}' ${BACKEND_URL}/api/testimonials",
                        returnStdout: true
                    ).trim()
                    
                    if (apiStatus == '200') {
                        success "✅ API endpoints are working (HTTP ${apiStatus})"
                    } else {
                        warning "⚠️ Some API endpoints may not be accessible (HTTP ${apiStatus})"
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Cleanup local artifacts
                sh '''
                    rm -f tej-backend.tar.gz tej-frontend.tar.gz
                '''
                
                echo "🧹 Cleanup completed"
            }
        }
        
        success {
            script {
                echo "🎉 Pipeline completed successfully!"
                echo "🌐 Application is live at:"
                echo "   Frontend: ${FRONTEND_URL}"
                echo "   Backend:  ${BACKEND_URL}"
                
                // Send notification (if configured)
                // slackSend(
                //     channel: '#deployments',
                //     color: 'good',
                //     message: "✅ Tej IT Site deployed successfully!\nFrontend: ${FRONTEND_URL}\nBackend: ${BACKEND_URL}"
                // )
            }
        }
        
        failure {
            script {
                error "❌ Pipeline failed!"
                
                // Attempt rollback via SSH
                sshagent(['ssh-deployer-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} "
                            cd /opt/tej-it-site
                            ./deploy.sh rollback
                        " || true
                    '''
                }
                
                // Send failure notification (if configured)
                // slackSend(
                //     channel: '#deployments',
                //     color: 'danger',
                //     message: "❌ Tej IT Site deployment failed! Check Jenkins logs."
                // )
            }
        }
    }
}