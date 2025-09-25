# Security Checklist for Tej IT Site 🔒

This document outlines security measures and best practices for the Tej IT Solutions deployment.

## ✅ Current Security Measures

### 1. Container Security
- [x] **Non-root users** in production containers
- [x] **Minimal base images** (Alpine Linux where possible)
- [x] **No unnecessary packages** in production images
- [x] **Health checks** to detect compromised containers
- [x] **Resource limits** to prevent DoS attacks

### 2. Secrets Management
- [x] **No secrets in code** - All sensitive data in environment variables
- [x] **Jenkins credentials store** for SSH keys and tokens
- [x] **Environment-specific configs** (.env files not in repo)
- [x] **Separate dev/prod credentials**

### 3. Network Security
- [x] **Docker internal network** for service communication
- [x] **Specific port exposure** only (3001, 5001)
- [x] **No direct database access** from outside containers

### 4. Access Control
- [x] **SSH key-based authentication** (no passwords)
- [x] **Limited user permissions** for deployment user
- [x] **Audit logging** in deployment scripts

## 🔧 Recommended Additional Security

### 1. Server Hardening
```bash
# Install and configure firewall
sudo ufw allow 22      # SSH
sudo ufw allow 3001    # Frontend
sudo ufw allow 5001    # Backend
sudo ufw deny incoming # Deny all other incoming
sudo ufw enable

# Install fail2ban for SSH protection
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

### 2. SSL/TLS Configuration (Recommended for Production)
```bash
# Install Nginx as reverse proxy
sudo apt install nginx certbot python3-certbot-nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/tej-it-site
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Frontend proxy
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Database Security
```bash
# Create dedicated database user
mysql -u root -p
CREATE USER 'tej_app'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON tej_it_db.* TO 'tej_app'@'localhost';
FLUSH PRIVILEGES;

# Enable MySQL SSL
# Add to /etc/mysql/mysql.conf.d/mysqld.cnf:
# ssl-ca=/var/lib/mysql/ca.pem
# ssl-cert=/var/lib/mysql/server-cert.pem
# ssl-key=/var/lib/mysql/server-key.pem
```

### 4. Application Security Headers

**Backend (Flask) Security Headers:**
```python
from flask import Flask
from flask_talisman import Talisman

app = Flask(__name__)

# Configure security headers
Talisman(app, {
    'force_https': True,
    'strict_transport_security': True,
    'content_security_policy': {
        'default-src': "'self'",
        'script-src': "'self' 'unsafe-inline'",
        'style-src': "'self' 'unsafe-inline'",
        'img-src': "'self' data: https:",
    }
})
```

**Frontend (Next.js) Security Headers:**
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

## 🔍 Security Monitoring

### 1. Log Monitoring
```bash
# Monitor access logs
tail -f /var/log/nginx/access.log

# Monitor error logs
tail -f /var/log/nginx/error.log

# Monitor container logs
docker-compose -f docker-compose.prod.yml logs -f

# Monitor system logs
sudo journalctl -f
```

### 2. Intrusion Detection
```bash
# Install AIDE (file integrity monitoring)
sudo apt install aide
sudo aideinit
sudo mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Run daily checks
sudo aide --check
```

### 3. Vulnerability Scanning
```bash
# Scan Docker images for vulnerabilities
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image tej-frontend:latest

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image tej-backend:latest
```

## 🚨 Incident Response

### 1. Security Incident Checklist
- [ ] **Isolate** affected systems
- [ ] **Document** what happened
- [ ] **Notify** stakeholders
- [ ] **Investigate** root cause
- [ ] **Remediate** vulnerabilities
- [ ] **Review** and improve security

### 2. Emergency Commands
```bash
# Immediately stop all services
./deploy.sh stop

# Block suspicious IP
sudo ufw deny from <suspicious-ip>

# Check for unauthorized access
sudo last
sudo lastlog

# Review authentication logs
sudo grep "Failed password" /var/log/auth.log
```

## 📋 Security Audit Checklist

### Monthly Security Review
- [ ] Update all system packages
- [ ] Review access logs for anomalies
- [ ] Check SSL certificate expiry
- [ ] Scan for vulnerabilities
- [ ] Review user access permissions
- [ ] Test backup and recovery procedures
- [ ] Update security documentation

### Quarterly Security Tasks
- [ ] Penetration testing
- [ ] Security training for team
- [ ] Review and update security policies
- [ ] Audit third-party dependencies
- [ ] Test incident response procedures

## 🔐 Password and Key Management

### SSH Key Management
```bash
# Generate new SSH key for deployment
ssh-keygen -t ed25519 -C "tej-deployment-key"

# Add to authorized_keys on server
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys

# Set proper permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Environment Variables Security
```bash
# Use strong, unique passwords
# Minimum 16 characters, mixed case, numbers, symbols

# Example secure environment setup
export DB_PASSWORD=$(openssl rand -base64 32)
export SECRET_KEY=$(openssl rand -hex 32)
export JWT_SECRET=$(openssl rand -base64 64)
```

## 📞 Security Contacts

- **Security Team**: security@tejitsolutions.com
- **Emergency**: +91-XXXX-XXXX-XX
- **DevOps Team**: devops@tejitsolutions.com

---

**Remember**: Security is everyone's responsibility! 🛡️

*Last updated: January 2025*