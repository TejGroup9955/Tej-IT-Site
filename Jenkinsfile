pipeline {
    agent any
    
    options {
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    environment {
        DEPLOY_SERVER = '10.10.50.93'
        DEPLOY_USER = 'deployer'
        DEPLOY_PATH = '/opt/tej-it-site'
        FRONTEND_PORT = '3001'
        BACKEND_PORT = '5001'
        DOCKER_BUILDKIT = '1'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code from repository...'
                checkout scm
                script {
                    env.BUILD_TIMESTAMP = sh(returnStdout: true, script: 'date +%Y%m%d-%H%M%S').trim()
                }
                echo "Build: ${env.BUILD_NUMBER} | Timestamp: ${env.BUILD_TIMESTAMP}"
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                script {
                    // Build backend image
                    echo 'Building backend image...'
                    sh """
                        cd backend
                        docker build -f Dockerfile.prod -t tej-backend:${env.BUILD_NUMBER} -t tej-backend:latest .
                    """
                    
                    // Build frontend image
                    echo 'Building frontend image...'
                    sh """
                        cd frontend
                        docker build -f Dockerfile.prod -t tej-frontend:${env.BUILD_NUMBER} -t tej-frontend:latest .
                    """
                    
                    echo '✅ Docker images built successfully'
                }
            }
        }
        
        stage('Test Images') {
            steps {
                echo '🧪 Running basic smoke tests...'
                script {
                    try {
                        // Test backend container
                        echo 'Testing backend container...'
                        sh """
                            docker run -d --name test-backend-${env.BUILD_NUMBER} -p 5002:5001 tej-backend:${env.BUILD_NUMBER}
                            sleep 15
                            curl -f http://localhost:5002/health || exit 1
                            echo '✅ Backend smoke test passed'
                        """
                        
                        // Test frontend container
                        echo 'Testing frontend container...'
                        sh """
                            docker run -d --name test-frontend-${env.BUILD_NUMBER} -p 3002:3001 tej-frontend:${env.BUILD_NUMBER}
                            sleep 20
                            curl -f http://localhost:3002 || exit 1
                            echo '✅ Frontend smoke test passed'
                        """
                        
                    } catch (Exception e) {
                        error "Smoke tests failed: ${e.getMessage()}"
                    } finally {
                        // Cleanup test containers
                        sh """
                            docker stop test-backend-${env.BUILD_NUMBER} || true
                            docker rm test-backend-${env.BUILD_NUMBER} || true
                            docker stop test-frontend-${env.BUILD_NUMBER} || true
                            docker rm test-frontend-${env.BUILD_NUMBER} || true
                        """
                    }
                }
            }
        }
        
        stage('Deploy to Server') {
            steps {
                echo '🚀 Deploying to production server...'
                script {
                    // Save Docker images as tar.gz
                    echo 'Saving Docker images...'
                    sh """
                        docker save tej-backend:${env.BUILD_NUMBER} | gzip > tej-backend-${env.BUILD_NUMBER}.tar.gz
                        docker save tej-frontend:${env.BUILD_NUMBER} | gzip > tej-frontend-${env.BUILD_NUMBER}.tar.gz
                        ls -lh *.tar.gz
                    """
                    
                    // Transfer files to server
                    echo 'Transferring files to server...'
                    sshagent(['ssh-deployer-key']) {
                        sh """
                            # Create deployment directory
                            ssh -o StrictHostKeyChecking=no ${env.DEPLOY_USER}@${env.DEPLOY_SERVER} "mkdir -p ${env.DEPLOY_PATH}/images"
                            
                            # Transfer Docker images
                            scp -o StrictHostKeyChecking=no tej-backend-${env.BUILD_NUMBER}.tar.gz ${env.DEPLOY_USER}@${env.DEPLOY_SERVER}:${env.DEPLOY_PATH}/images/
                            scp -o StrictHostKeyChecking=no tej-frontend-${env.BUILD_NUMBER}.tar.gz ${env.DEPLOY_USER}@${env.DEPLOY_SERVER}:${env.DEPLOY_PATH}/images/
                            
                            # Transfer deployment files
                            scp -o StrictHostKeyChecking=no deploy.sh ${env.DEPLOY_USER}@${env.DEPLOY_SERVER}:${env.DEPLOY_PATH}/
                            scp -o StrictHostKeyChecking=no docker-compose.prod.yml ${env.DEPLOY_USER}@${env.DEPLOY_SERVER}:${env.DEPLOY_PATH}/
                            
                            echo '✅ Files transferred successfully'
                        """
                    }
                    
                    // Load images and deploy
                    echo 'Loading images and deploying...'
                    sshagent(['ssh-deployer-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${env.DEPLOY_USER}@${env.DEPLOY_SERVER} "
                                cd ${env.DEPLOY_PATH}
                                
                                # Load Docker images
                                echo 'Loading Docker images...'
                                docker load < images/tej-backend-${env.BUILD_NUMBER}.tar.gz
                                docker load < images/tej-frontend-${env.BUILD_NUMBER}.tar.gz
                                
                                # Tag as latest
                                docker tag tej-backend:${env.BUILD_NUMBER} tej-backend:latest
                                docker tag tej-frontend:${env.BUILD_NUMBER} tej-frontend:latest
                                
                                # Make deploy script executable
                                chmod +x deploy.sh
                                
                                # Deploy application
                                echo 'Deploying application...'
                                ./deploy.sh deploy
                            "
                        """
                    }
                    
                    echo '✅ Deployment completed'
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo '✅ Verifying deployment...'
                script {
                    // Wait for services to be ready
                    sleep(time: 20, unit: 'SECONDS')
                    
                    // Verify frontend
                    echo 'Checking frontend health...'
                    def frontendStatus = sh(
                        script: "curl -f -s -o /dev/null -w '%{http_code}' http://${env.DEPLOY_SERVER}:${env.FRONTEND_PORT}",
                        returnStdout: true
                    ).trim()
                    
                    if (frontendStatus != '200') {
                        error "Frontend health check failed. HTTP Status: ${frontendStatus}"
                    }
                    
                    // Verify backend
                    echo 'Checking backend health...'
                    def backendStatus = sh(
                        script: "curl -f -s -o /dev/null -w '%{http_code}' http://${env.DEPLOY_SERVER}:${env.BACKEND_PORT}/health",
                        returnStdout: true
                    ).trim()
                    
                    if (backendStatus != '200') {
                        error "Backend health check failed. HTTP Status: ${backendStatus}"
                    }
                    
                    echo '🎉 All health checks passed!'
                    echo "Frontend: http://${env.DEPLOY_SERVER}:${env.FRONTEND_PORT}"
                    echo "Backend: http://${env.DEPLOY_SERVER}:${env.BACKEND_PORT}"
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up...'
            script {
                // Cleanup local tar.gz files
                sh 'rm -f *.tar.gz || true'
                
                // Cleanup old Docker images (keep last 3 builds)
                sh """
                    docker images tej-backend --format "table {{.Tag}}" | grep -E '^[0-9]+\$' | sort -nr | tail -n +4 | xargs -r docker rmi tej-backend: || true
                    docker images tej-frontend --format "table {{.Tag}}" | grep -E '^[0-9]+\$' | sort -nr | tail -n +4 | xargs -r docker rmi tej-frontend: || true
                """
            }
        }
        
        success {
            echo '🎉 Pipeline completed successfully!'
            echo "🌐 Application is live at:"
            echo "   Frontend: http://${env.DEPLOY_SERVER}:${env.FRONTEND_PORT}"
            echo "   Backend:  http://${env.DEPLOY_SERVER}:${env.BACKEND_PORT}"
            
            // Optional: Send notification
            // slackSend(channel: '#deployments', message: "✅ Tej IT Site deployed successfully - Build #${env.BUILD_NUMBER}")
        }
        
        failure {
            echo '❌ Pipeline failed!'
            echo 'Check logs above for details. Automatic rollback may have been triggered.'
            
            // Optional: Send notification
            // slackSend(channel: '#deployments', message: "❌ Tej IT Site deployment failed - Build #${env.BUILD_NUMBER}")
        }
        
        unstable {
            echo '⚠️ Pipeline completed with warnings'
        }
    }
}