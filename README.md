# Tej IT Solutions - Complete Website & Automation

A modern, full-stack web application with automated deployment pipeline.

## 🏗️ Architecture

- **Frontend**: Next.js (TypeScript) - Port 3001
- **Backend**: Python Flask - Port 5001
- **Database**: MySQL (via backend connection)
- **Deployment**: Docker + Jenkins CI/CD

## 🚀 Quick Start

### Local Development

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

# Frontend
cd frontend
npm install
npm run dev
```

### Production Deployment

```bash
# Build and deploy with Docker
docker-compose -f docker-compose.prod.yml up -d

# Or use deployment script
chmod +x deploy.sh
./deploy.sh deploy
```

## 🐳 Docker Usage

### Build Images
```bash
# Backend
cd backend
docker build -f Dockerfile.prod -t tej-backend:latest .

# Frontend
cd frontend
docker build -f Dockerfile.prod -t tej-frontend:latest .
```

### Run with Docker Compose
```bash
# Production
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔄 Jenkins CI/CD

### Pipeline Overview
1. **Checkout** - Clone repository
2. **Build** - Create Docker images
3. **Test** - Smoke tests on containers
4. **Deploy** - Transfer and deploy to server
5. **Verify** - Health checks

### Setup Jenkins
1. Install required plugins: SSH Agent, Docker Pipeline
2. Add credentials:
   - `ssh-deployer-key` - SSH private key for deployment server
   - `github-token` - GitHub access token (if private repo)
3. Create new Pipeline job pointing to this repository

### Environment Variables
```bash
DEPLOY_SERVER=10.10.50.93
DEPLOY_USER=deployer
DEPLOY_PATH=/opt/tej-it-site
FRONTEND_PORT=3001
BACKEND_PORT=5001
```

## 🧪 Testing with JMeter

### Setup
```bash
cd jmeter_tests
# Follow setup-guide.md for detailed instructions
```

### Run Tests
```bash
# Smoke test
jmeter -n -t tej-it-site-testplan.jmx -l smoke-results.jtl -e -o smoke-report

# Load test
jmeter -n -t tej-it-site-testplan.jmx -l load-results.jtl -e -o load-report
```

## 📋 Deployment Commands

```bash
# Deploy application
./deploy.sh deploy

# Check status
./deploy.sh status

# View logs
./deploy.sh logs

# Stop application
./deploy.sh stop

# Rollback (emergency)
./deploy.sh rollback
```

## 🔧 Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend

# Check container status
docker ps -a
```

**Port conflicts:**
```bash
# Check what's using the ports
sudo netstat -tulpn | grep :3001
sudo netstat -tulpn | grep :5001

# Stop conflicting services
sudo systemctl stop nginx  # if using nginx
```

**Health checks failing:**
```bash
# Test endpoints manually
curl http://10.10.50.93:3001
curl http://10.10.50.93:5001/health

# Check container health
docker inspect tej-backend-prod | grep Health -A 10
docker inspect tej-frontend-prod | grep Health -A 10
```

### Emergency Procedures

**Quick Rollback:**
```bash
./deploy.sh rollback
```

**Complete Reset:**
```bash
docker-compose -f docker-compose.prod.yml down -v
docker system prune -f
./deploy.sh deploy
```

**Check Resource Usage:**
```bash
docker stats
df -h
free -h
```

## 🔒 Security

- ✅ Non-root containers
- ✅ Resource limits
- ✅ Health checks
- ✅ No secrets in code
- ✅ Secure SSH deployment

### Recommended Firewall Rules
```bash
# Allow SSH (22), Frontend (3001), Backend (5001)
sudo ufw allow 22
sudo ufw allow 3001
sudo ufw allow 5001
sudo ufw enable
```

## 📊 Monitoring

### Container Health
```bash
# Real-time stats
docker stats

# Health status
docker-compose -f docker-compose.prod.yml ps
```

### Application Logs
```bash
# Follow logs
./deploy.sh logs

# Specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

## 🌐 URLs

- **Frontend**: http://10.10.50.93:3001
- **Backend**: http://10.10.50.93:5001
- **Health Check**: http://10.10.50.93:5001/health

## 📁 Project Structure

```
Tej-IT-Site/
├── backend/                 # Flask backend
│   ├── app.py              # Main application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile.prod     # Production Dockerfile
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── package.json       # Node dependencies
│   └── Dockerfile.prod    # Production Dockerfile
├── jmeter_tests/          # Performance testing
├── scripts/               # Utility scripts
├── docker-compose.prod.yml # Production compose
├── deploy.sh              # Deployment script
├── Jenkinsfile           # CI/CD pipeline
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test locally
4. Submit a pull request
5. Jenkins will automatically test and deploy

## 📞 Support

For deployment issues or questions:
- Email: support@tejitsolutions.com
- Check logs: `./deploy.sh logs`
- Status check: `./deploy.sh status`

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintained by**: Tej IT Solutions DevOps Team