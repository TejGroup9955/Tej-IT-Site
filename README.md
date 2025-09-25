# Tej IT Solutions - Complete Deployment Automation 🚀

A comprehensive automation suite for deploying the Tej IT Solutions website with full CI/CD pipeline, performance testing, and monitoring.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Performance Testing](#performance-testing)
- [Monitoring & Troubleshooting](#monitoring--troubleshooting)
- [Security](#security)

## 🏗️ Project Overview

**Tej IT Solutions** is a modern web application consisting of:
- **Frontend**: Next.js (TypeScript) - Port 3001
- **Backend**: Python Flask - Port 5001
- **Database**: MySQL (configured separately)

**Live URLs:**
- Frontend: http://10.10.50.93:3001
- Backend API: http://10.10.50.93:5001

## 🏛️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Python Flask  │
│   Frontend      │◄──►│   Backend       │
│   Port 3001     │    │   Port 5001     │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                   │
            ┌─────────────┐
            │   MySQL     │
            │  Database   │
            └─────────────┘
```

### Technology Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Python Flask, MySQL, JWT Authentication
- **DevOps**: Docker, Jenkins, JMeter, Nginx (optional)
- **Deployment**: Docker Compose, Automated Scripts

## ⚡ Quick Start

### Prerequisites
```bash
# Install required tools
sudo apt update
sudo apt install docker.io docker-compose git curl

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
```

### One-Command Deployment
```bash
# Clone and deploy
git clone https://github.com/TejGroup9955/Tej-IT-Site.git
cd Tej-IT-Site
chmod +x deploy.sh
./deploy.sh deploy
```

That's it! Your application will be live at:
- Frontend: http://10.10.50.93:3001
- Backend: http://10.10.50.93:5001

## 💻 Development Setup

### Local Development
```bash
# Clone repository
git clone https://github.com/TejGroup9955/Tej-IT-Site.git
cd Tej-IT-Site

# Start development environment
docker-compose up --build

# Access applications
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Manual Development Setup
```bash
# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

## 🚀 Production Deployment

### Automated Deployment
```bash
# Full deployment with health checks
./deploy.sh deploy

# Check deployment status
./deploy.sh status

# View logs
./deploy.sh logs

# Emergency rollback
./deploy.sh rollback
```

### Manual Deployment Steps
```bash
# 1. Update code
git pull origin main

# 2. Build and start containers
docker-compose -f docker-compose.prod.yml up --build -d

# 3. Verify deployment
curl http://10.10.50.93:3001
curl http://10.10.50.93:5001/health
```

### Environment Configuration
Create `.env` files for production:

**Backend (.env):**
```bash
FLASK_ENV=production
DB_HOST=your-db-host
DB_PASSWORD=your-db-password
SECRET_KEY=your-secret-key
FRONTEND_URL=http://10.10.50.93:3001
```

**Frontend (.env.local):**
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://10.10.50.93:5001
```

## 🔄 CI/CD Pipeline

### Jenkins Setup

1. **Install Jenkins**
```bash
# Install Java
sudo apt install openjdk-11-jdk

# Install Jenkins
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

2. **Configure Credentials**
   - Go to Jenkins → Manage Jenkins → Manage Credentials
   - Add `ssh-deployer-key` (SSH private key for server access)
   - Add `github-token` (GitHub personal access token)

3. **Create Pipeline Job**
   - New Item → Pipeline
   - Pipeline script from SCM
   - Repository: https://github.com/TejGroup9955/Tej-IT-Site.git
   - Script Path: Jenkinsfile

### Pipeline Stages Explained

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Checkout   │──►│ Code Analysis│──►│Build Images │──►│Test Images  │
│             │   │             │   │             │   │             │
│ • Git clone │   │ • Lint code │   │ • Docker    │   │ • Health    │
│ • Get commit│   │ • Scan APIs │   │   build     │   │   checks    │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
                                                              │
┌─────────────┐   ┌─────────────┐                           │
│   Verify    │◄──│   Deploy    │◄──────────────────────────┘
│             │   │             │
│ • Smoke     │   │ • Transfer  │
│   tests     │   │   images    │
│ • API calls │   │ • Run       │
└─────────────┘   │   deploy.sh │
                  └─────────────┘
```

## 🧪 Performance Testing

### JMeter Test Suite

We have three types of performance tests:

1. **Smoke Test** (1 user, 1 loop)
   - Quick sanity check
   - Tests basic functionality
   - Run after every deployment

2. **Load Test** (50-200 users, 5 minutes)
   - Simulates normal traffic
   - Tests performance under expected load
   - Run before major releases

3. **Stress Test** (500 users, 10 minutes)
   - Finds breaking point
   - Tests maximum capacity
   - Run for capacity planning

### Running Tests
```bash
# Install JMeter
wget https://downloads.apache.org/jmeter/binaries/apache-jmeter-5.6.3.tgz
tar -xzf apache-jmeter-5.6.3.tgz
sudo mv apache-jmeter-5.6.3 /opt/jmeter

# Run smoke test
jmeter -n -t jmeter_tests/tej-it-site-testplan.jmx -l smoke-results.jtl

# Run load test
jmeter -n -t jmeter_tests/tej-it-site-testplan.jmx -l load-results.jtl -Jtest.type=load
```

### Performance Targets
- **Response Time**: < 2 seconds
- **Error Rate**: < 1%
- **Concurrent Users**: 100+ without degradation
- **Throughput**: 50+ requests/second

## 📊 Monitoring & Troubleshooting

### Health Checks
```bash
# Quick health check
curl http://10.10.50.93:3001        # Frontend
curl http://10.10.50.93:5001/health # Backend

# Detailed status
./deploy.sh status

# Container logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Common Issues & Solutions

**1. Port conflicts**
```bash
# Check what's using ports
sudo netstat -tulpn | grep :3001
sudo netstat -tulpn | grep :5001

# Kill conflicting processes
sudo kill -9 <process-id>
```

**2. Out of disk space**
```bash
# Clean Docker
docker system prune -a
docker volume prune

# Check disk usage
df -h
```

**3. Container won't start**
```bash
# Check logs
docker logs tej-frontend-prod
docker logs tej-backend-prod

# Rebuild images
docker-compose -f docker-compose.prod.yml build --no-cache
```

**4. Database connection issues**
```bash
# Check database connectivity
docker exec -it tej-backend-prod python -c "import mysql.connector; print('DB OK')"

# Verify environment variables
docker exec -it tej-backend-prod env | grep DB_
```

### Monitoring Commands
```bash
# System resources
htop                    # CPU/Memory usage
df -h                   # Disk usage
docker stats           # Container resource usage

# Application logs
./deploy.sh logs       # All logs
docker logs tej-frontend-prod  # Frontend logs
docker logs tej-backend-prod   # Backend logs

# Network connectivity
curl -I http://10.10.50.93:3001  # Frontend check
curl -I http://10.10.50.93:5001  # Backend check
```

## 🔒 Security

### Security Measures Implemented

1. **Container Security**
   - Non-root users in containers
   - Minimal base images (Alpine Linux)
   - No unnecessary packages

2. **Network Security**
   - Firewall rules for specific ports only
   - Internal Docker network for service communication
   - No direct database access from outside

3. **Secrets Management**
   - Environment variables for sensitive data
   - Jenkins credentials store
   - No hardcoded passwords in code

4. **Access Control**
   - SSH key-based authentication
   - Limited sudo access
   - Audit logs for deployments

### Recommended Additional Security

```bash
# Install fail2ban (SSH protection)
sudo apt install fail2ban

# Configure firewall
sudo ufw allow 22    # SSH
sudo ufw allow 3001  # Frontend
sudo ufw allow 5001  # Backend
sudo ufw enable

# SSL/TLS with reverse proxy (optional)
sudo apt install nginx certbot
# Configure Nginx as reverse proxy with SSL
```

## 📁 File Structure

```
Tej-IT-Site/
├── backend/                    # Python Flask backend
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile.prod        # Production Docker image
│   └── templates/             # HTML templates
├── frontend/                   # Next.js frontend
│   ├── app/                   # Next.js app directory
│   ├── components/            # React components
│   ├── package.json           # Node.js dependencies
│   └── Dockerfile.prod        # Production Docker image
├── scripts/
│   └── scan-endpoints.py      # API endpoint scanner
├── jmeter_tests/
│   ├── tej-it-site-testplan.jmx  # JMeter test plan
│   └── setup-guide.md         # JMeter usage guide
├── docker-compose.prod.yml    # Production compose file
├── Jenkinsfile               # CI/CD pipeline
├── deploy.sh                 # Deployment script
├── setup_and_flow.md         # This guide
└── README.md                 # Project documentation
```

## 🚀 Getting Started Checklist

- [ ] Clone repository
- [ ] Install Docker and Docker Compose
- [ ] Configure environment variables
- [ ] Run `./deploy.sh deploy`
- [ ] Verify at http://10.10.50.93:3001
- [ ] Set up Jenkins (optional)
- [ ] Run JMeter tests (optional)
- [ ] Configure monitoring (optional)

## 🆘 Support

### Getting Help
1. **Check logs**: `./deploy.sh logs`
2. **Run health checks**: `./deploy.sh status`
3. **Review this documentation**
4. **Check troubleshooting section**

### Emergency Contacts
- **DevOps Team**: devops@tejitsolutions.com
- **Development Team**: dev@tejitsolutions.com
- **Support**: support@tejitsolutions.com

### Useful Links
- [Docker Documentation](https://docs.docker.com/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [JMeter Documentation](https://jmeter.apache.org/usermanual/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)

---

**Happy Deploying! 🎉**

*Last updated: January 2025*