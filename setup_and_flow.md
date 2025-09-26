# Setup & Flow Guide for Tej IT Site 🚀

This document explains the **simplified deployment flow** in **simple terms**.  
Each phase is broken into steps with comments so even freshers can follow.

---

## 🔹 1. Project Structure (What We Have)
- **Frontend** → Next.js (TypeScript), runs on port **3001**.
- **Backend** → Python Flask, runs on port **5001**.
- **Repo** → https://github.com/TejGroup9955/Tej-IT-Site.git
- **Target Server** → 10.10.50.93 (where we deploy)

---

## 🔹 2. Dockerization (Why & How)
**Why Docker?** → Makes our app run the same everywhere (dev, test, prod).

We build **two containers**:
- `tej-frontend` → holds Next.js app
- `tej-backend` → holds Flask app

**Files involved:**
- `backend/Dockerfile.prod` → Recipe to build backend container
- `frontend/Dockerfile.prod` → Recipe to build frontend container
- `docker-compose.prod.yml` → Links both containers together

**Result:**
- Frontend URL → `http://10.10.50.93:3001`
- Backend URL → `http://10.10.50.93:5001`

👉 **Run manually with:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔹 3. Deployment Script (deploy.sh)
**What it does:** Automates the deployment process.

**Commands available:**
```bash
./deploy.sh deploy    # Deploy the app
./deploy.sh status    # Check if app is running
./deploy.sh logs      # Show app logs
./deploy.sh stop      # Stop the app
./deploy.sh rollback  # Emergency rollback
```

**How `deploy` works:**
1. **Stop** old containers (if any)
2. **Start** new containers from latest images
3. **Wait** for health checks to pass
4. **Test** frontend and backend URLs
5. **Report** success or failure

**Safety features:**
- ✅ **Idempotent** → Safe to run multiple times
- ✅ **Health checks** → Waits for services to be ready
- ✅ **Rollback** → Automatic rollback if deployment fails

---

## 🔹 4. Jenkins CI/CD Pipeline (Automated Deployment)

**What is Jenkins?** → A tool that automatically deploys code when you push changes.

**Our Pipeline has 5 stages:**

### Stage 1: Checkout 📥
```groovy
// What happens: Downloads latest code from GitHub
checkout scm
```
**Comment:** Like doing `git pull` but automated.

### Stage 2: Build Docker Images 🐳
```groovy
// Backend
docker build -f Dockerfile.prod -t tej-backend:123 .

// Frontend  
docker build -f Dockerfile.prod -t tej-frontend:123 .
```
**Comment:** Creates containers with our code inside. Number `123` is the build number.

### Stage 3: Test Images 🧪
```groovy
// Start test containers
docker run -d --name test-backend -p 5002:5001 tej-backend:123
docker run -d --name test-frontend -p 3002:3001 tej-frontend:123

// Test if they work
curl http://localhost:5002/health  # Backend test
curl http://localhost:3002         # Frontend test

// Cleanup test containers
docker stop test-backend test-frontend
docker rm test-backend test-frontend
```
**Comment:** Like a "practice run" before real deployment.

### Stage 4: Deploy to Server 🚀
```groovy
// Save images as files
docker save tej-backend:123 | gzip > tej-backend-123.tar.gz
docker save tej-frontend:123 | gzip > tej-frontend-123.tar.gz

// Copy to server
scp *.tar.gz deployer@10.10.50.93:/opt/tej-it-site/images/
scp deploy.sh deployer@10.10.50.93:/opt/tej-it-site/

// Load and deploy on server
ssh deployer@10.10.50.93 "
  cd /opt/tej-it-site
  docker load < images/tej-backend-123.tar.gz
  docker load < images/tej-frontend-123.tar.gz
  ./deploy.sh deploy
"
```
**Comment:** Copies our containers to the live server and runs them.

### Stage 5: Verify Deployment ✅
```groovy
// Test live URLs
curl http://10.10.50.93:3001  # Frontend
curl http://10.10.50.93:5001/health  # Backend
```
**Comment:** Final check to make sure everything works on the live server.

---

## 🔹 5. How to Use This System

### For Developers:
1. **Make changes** to code
2. **Push to GitHub** → `git push origin main`
3. **Jenkins automatically** builds and deploys
4. **Check** http://10.10.50.93:3001 to see your changes live

### For DevOps/Admins:
1. **Monitor Jenkins** → http://10.10.50.56:8080 (Jenkins server)
2. **Check deployment** → `ssh deployer@10.10.50.93` then `./deploy.sh status`
3. **View logs** → `./deploy.sh logs`
4. **Emergency stop** → `./deploy.sh stop`

---

## 🔹 6. What Happens When You Push Code?

```
Developer pushes code
         ↓
Jenkins detects change (webhook)
         ↓
Jenkins runs pipeline:
  1. Downloads code
  2. Builds Docker images
  3. Tests images locally
  4. Copies to production server
  5. Deploys on server
  6. Verifies deployment
         ↓
✅ Live website updated!
```

**Timeline:** Usually takes **3-5 minutes** from push to live.

---

## 🔹 7. Emergency Procedures

### If Website is Down:
```bash
# 1. Check status
ssh deployer@10.10.50.93
cd /opt/tej-it-site
./deploy.sh status

# 2. Check logs
./deploy.sh logs

# 3. Try restart
./deploy.sh deploy

# 4. If still broken, rollback
./deploy.sh rollback
```

### If Jenkins Pipeline Fails:
1. **Check Jenkins logs** → Go to failed build, click "Console Output"
2. **Common fixes:**
   - Docker out of space → `docker system prune -f`
   - SSH connection issues → Check SSH keys
   - Port conflicts → Check if ports 3001/5001 are free

---

## 🔹 8. File Explanations

| File | Purpose | When to Edit |
|------|---------|--------------|
| `Jenkinsfile` | CI/CD pipeline definition | When changing deployment process |
| `deploy.sh` | Deployment automation script | When changing deployment logic |
| `docker-compose.prod.yml` | Production container setup | When changing ports/environment |
| `backend/Dockerfile.prod` | Backend container recipe | When changing backend dependencies |
| `frontend/Dockerfile.prod` | Frontend container recipe | When changing frontend build process |

---

## 🔹 9. Security Notes

- ✅ **No passwords in code** → All secrets in Jenkins credentials
- ✅ **SSH key authentication** → No password-based SSH
- ✅ **Non-root containers** → Containers run as regular users
- ✅ **Firewall configured** → Only necessary ports open
- ✅ **Health checks** → Automatic failure detection

---

## 🔹 10. Monitoring & Maintenance

### Daily Checks:
- ✅ Website loads → http://10.10.50.93:3001
- ✅ Backend responds → http://10.10.50.93:5001/health
- ✅ Jenkins is green → No failed builds

### Weekly Maintenance:
```bash
# Cleanup old Docker images
docker system prune -f

# Check disk space
df -h

# Update system packages
sudo apt update && sudo apt upgrade
```

---

## 🔹 11. Getting Help

**For Developers:**
- Check Jenkins build logs first
- Test locally with Docker before pushing
- Use `./deploy.sh status` to check production

**For DevOps:**
- Monitor server resources (CPU, memory, disk)
- Keep Jenkins and Docker updated
- Regular backups of deployment configurations

**Emergency Contacts:**
- DevOps Team: devops@tejitsolutions.com
- System Admin: admin@tejitsolutions.com

---

**Remember:** This system is designed to be **simple and reliable**. When in doubt, check the logs first! 📊