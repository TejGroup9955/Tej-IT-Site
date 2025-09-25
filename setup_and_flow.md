# Setup & Flow Guide for Tej IT Site 🚀

This document explains the **deployment flow** of our project in **simple terms**.  
Each phase is broken into steps with comments so even freshers can follow.

---

## 🔹 1. Project Structure
- **Frontend** → Next.js (TypeScript), runs on port **3001**.
- **Backend** → Python Flask, runs on port **5001**.
- **Repo** → https://github.com/TejGroup9955/Tej-IT-Site.git

---

## 🔹 2. Dockerization

### Why Docker? 🐳
Docker packages our application with all its dependencies into containers. This means:
- ✅ Same environment everywhere (dev, staging, production)
- ✅ No "it works on my machine" problems
- ✅ Easy scaling and deployment

### Our Docker Setup:
```
tej-frontend container  →  Next.js app on port 3001
tej-backend container   →  Flask app on port 5001
```

**How it works:**
1. `Dockerfile.prod` (backend) → Builds Python Flask container
2. `Dockerfile.prod` (frontend) → Builds Next.js container  
3. `docker-compose.prod.yml` → Links both containers together

**URLs after deployment:**
- Frontend: `http://10.10.50.93:3001`
- Backend: `http://10.10.50.93:5001`

---

## 🔹 3. Deployment Script (`deploy.sh`)

### What it does:
This script automates the entire deployment process. Think of it as a "one-click deploy" button.

### Step-by-step flow:
```bash
1. Check prerequisites (Docker, Git, curl installed?)
2. Create project directory (/opt/tej-it-site)
3. Clone/update code from GitHub
4. Stop any running containers
5. Build new Docker images
6. Start containers with health checks
7. Wait for services to be ready
8. Run smoke tests (curl checks)
9. Show deployment status
```

### Usage:
```bash
# Deploy the application
./deploy.sh deploy

# Check status
./deploy.sh status

# Stop services
./deploy.sh stop

# View logs
./deploy.sh logs

# Rollback if something goes wrong
./deploy.sh rollback
```

### Safety Features:
- **Idempotent** → Safe to run multiple times
- **Health checks** → Waits for services to be ready
- **Rollback** → Can restore previous version if deployment fails
- **Smoke tests** → Verifies everything works before declaring success

---

## 🔹 4. Jenkins CI/CD Pipeline

### What is CI/CD? 🤖
- **CI (Continuous Integration)** → Automatically test code when developers push changes
- **CD (Continuous Deployment)** → Automatically deploy tested code to production

### Our Jenkins Pipeline Flow:
```
1. 📥 Checkout → Get latest code from GitHub
2. 🔍 Code Analysis → Scan for endpoints, run linting
3. 🔨 Build → Create Docker images
4. 🧪 Test → Test the images work correctly
5. 🚀 Deploy → Push to production server (10.10.50.93)
6. ✅ Verify → Check everything is working
```

### Jenkins Credentials Setup:
```bash
# SSH key for server access
ssh-deployer-key → Private key to access 10.10.50.93

# GitHub access token
github-token → Token to clone private repos
```

### How to trigger:
- **Automatic** → Runs when code is pushed to main branch
- **Manual** → Click "Build Now" in Jenkins
- **Scheduled** → Can run daily/weekly for health checks

---

## 🔹 5. JMeter Performance Testing

### What is JMeter? 📊
JMeter simulates multiple users accessing your website to test performance under load.

### Our Test Types:

**1. Smoke Test (1 user)**
- Quick check that everything works
- Tests homepage and basic API calls
- Run after every deployment

**2. Load Test (50-200 users)**
- Simulates normal traffic
- Tests how site performs under expected load
- Run before major releases

**3. Stress Test (500 users)**
- Finds the breaking point
- Tests maximum capacity
- Run for capacity planning

### How to run:
```bash
# GUI mode (for beginners)
jmeter

# Command line (for automation)
jmeter -n -t jmeter_tests/tej-it-site-testplan.jmx -l results.jtl
```

### What to look for:
- **Response Time** → Should be < 2 seconds
- **Error Rate** → Should be < 1%
- **Throughput** → Requests per second

---

## 🔹 6. Security Checklist ✅

### What we protect:
1. **No secrets in code** → Database passwords, API keys stored securely
2. **Jenkins credentials** → SSH keys and tokens stored in Jenkins vault
3. **Server firewall** → Only ports 22 (SSH), 3001, 5001 open
4. **Container security** → Apps run as non-root users
5. **SSL ready** → Can add reverse proxy + SSL certificates

### Security best practices:
- Regular security updates
- Monitor access logs
- Use strong passwords
- Enable fail2ban for SSH protection

---

## 🔹 7. Complete Workflow Example

### Developer pushes code:
```
1. Developer commits code → GitHub
2. Jenkins detects change → Starts pipeline
3. Pipeline runs tests → Builds Docker images
4. If tests pass → Deploys to 10.10.50.93
5. Smoke tests verify → Deployment complete
6. If anything fails → Automatic rollback
```

### Manual deployment:
```bash
# SSH to server
ssh deployer@10.10.50.93

# Run deployment
cd /opt/tej-it-site
./deploy.sh deploy

# Check status
./deploy.sh status
```

---

## 🔹 8. Troubleshooting Guide

### Common Issues:

**1. "Connection refused" errors**
```bash
# Check if containers are running
docker ps

# Check container logs
docker-compose -f docker-compose.prod.yml logs

# Restart services
./deploy.sh deploy
```

**2. "Port already in use"**
```bash
# Find what's using the port
sudo netstat -tulpn | grep :3001

# Kill the process
sudo kill -9 <process-id>

# Or stop all containers
./deploy.sh stop
```

**3. "Out of disk space"**
```bash
# Clean up Docker
docker system prune -a

# Check disk usage
df -h

# Clean up old images
docker image prune -f
```

**4. "Permission denied"**
```bash
# Fix file permissions
sudo chown -R $USER:$USER /opt/tej-it-site

# Make scripts executable
chmod +x deploy.sh
```

### Health Check Commands:
```bash
# Check frontend
curl http://10.10.50.93:3001

# Check backend
curl http://10.10.50.93:5001/health

# Check API
curl http://10.10.50.93:5001/api/testimonials
```

---

## 🔹 9. Monitoring & Maintenance

### Daily Checks:
- ✅ Website is accessible
- ✅ No error logs in containers
- ✅ Disk space > 20% free
- ✅ Memory usage < 80%

### Weekly Tasks:
- 🔄 Run load tests
- 📊 Review performance metrics
- 🧹 Clean up old Docker images
- 📋 Check security updates

### Monthly Tasks:
- 🔒 Security audit
- 📈 Capacity planning review
- 🔄 Backup verification
- 📚 Update documentation

---

## 🔹 10. Quick Reference Commands

```bash
# Deployment
./deploy.sh deploy          # Full deployment
./deploy.sh status          # Check status
./deploy.sh stop           # Stop services
./deploy.sh logs           # View logs
./deploy.sh rollback       # Emergency rollback

# Docker
docker ps                  # List running containers
docker logs <container>    # View container logs
docker stats              # Resource usage
docker system prune -f    # Cleanup

# Testing
jmeter -n -t test.jmx -l results.jtl    # Run tests
curl http://10.10.50.93:3001            # Quick frontend check
curl http://10.10.50.93:5001/health     # Quick backend check

# Monitoring
htop                      # System resources
df -h                     # Disk usage
netstat -tulpn           # Port usage
```

---

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Frontend loads at http://10.10.50.93:3001
- ✅ Backend health check passes at http://10.10.50.93:5001/health
- ✅ API endpoints return data (not errors)
- ✅ JMeter smoke tests pass
- ✅ No error logs in containers
- ✅ Response times < 3 seconds

---

**Remember**: This automation saves time and reduces human errors. Always test in a staging environment first! 🛡️