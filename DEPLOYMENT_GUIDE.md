# HRMS Lite - Deployment Guide

## 🚀 Production Deployment

This guide covers deploying HRMS Lite to production environments.

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### Prerequisites
- Vercel account (free tier available)
- GitHub account (recommended)

#### Steps

1. **Build the application**
   ```bash
   cd hrms-frontend
   npm install
   npm run build
   ```

2. **Upload to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select `hrms-frontend` as the root directory
   - Set environment variable:
     - `VITE_API_URL=https://victorious-courage-production.up.railway.app/api`
   - Click Deploy

3. **Configure environment (if needed)**
   ```
   hrms-frontend/.env.production
   VITE_API_URL=https://victorious-courage-production.up.railway.app/api
   ```

4. **Access your app**
   - Vercel provides a URL automatically
   - Configure custom domain in settings

### Option 2: Netlify

1. **Build the application**
   ```bash
   cd hrms-frontend
   npm run build
   ```

2. **Deploy**
   - Go to https://app.netlify.com/
   - Click "New site from Git"
   - Connect your repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy

### Option 3: GitHub Pages

1. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/hrms-lite"
   }
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy scripts**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

---

## Backend Deployment

### Current: Railway (Already Deployed)

The backend is already running on Railway at:
```
https://victorious-courage-production.up.railway.app
```

#### How it works:
- Connected to GitHub repository
- Auto-deploys on git push
- PostgreSQL database included
- Environment variables configured

#### To redeploy:
```bash
git push origin main
```

### Option 1: Deploy to Heroku

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Create Heroku app**
   ```bash
   heroku login
   heroku create your-app-name
   ```

2. **Add PostgreSQL addon**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Set environment variables**
   ```bash
   heroku config:set DATABASE_URL=postgresql://...
   ```

4. **Create Procfile** (in backend root)
   ```
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: Deploy to AWS EC2

#### Prerequisites
- AWS account
- EC2 instance running Ubuntu
- SSH access configured

#### Steps

1. **Connect to instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

2. **Install dependencies**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv postgresql postgresql-contrib nginx
   ```

3. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/hrms-lite.git
   cd hrms-lite/backend
   ```

4. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

5. **Configure PostgreSQL**
   ```bash
   sudo -u postgres createdb hrms_db
   sudo -u postgres createuser hrms_user
   ```

6. **Set environment variables**
   ```bash
   nano .env
   # Add: DATABASE_URL=postgresql://hrms_user:password@localhost/hrms_db
   ```

7. **Run migrations**
   ```bash
   python -m alembic upgrade head
   ```

8. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   
   # Add:
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://127.0.0.1:8000;
       }
   }
   ```

9. **Start services**
   ```bash
   gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
   sudo systemctl restart nginx
   ```

### Option 3: Deploy with Docker

#### Create Dockerfile (backend)
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Create docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: hrms_db
      POSTGRES_USER: hrms_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  web:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://hrms_user:your_password@db:5432/hrms_db
    depends_on:
      - db

volumes:
  postgres_data:
```

#### Deploy
```bash
docker-compose up -d
```

---

## Production Checklist

### Backend
- [ ] Database backed up
- [ ] Environment variables secured
- [ ] SSL/TLS enabled
- [ ] CORS configured for production domain
- [ ] Logging configured
- [ ] Error monitoring set up (e.g., Sentry)
- [ ] Database migrations tested
- [ ] API documentation reviewed
- [ ] Rate limiting configured
- [ ] Authentication enabled (optional)

### Frontend
- [ ] Build optimized (npm run build)
- [ ] Environment variables set correctly
- [ ] API URL points to production backend
- [ ] Error tracking enabled (e.g., Sentry)
- [ ] Analytics configured (optional)
- [ ] SEO optimized (if needed)
- [ ] Performance tested
- [ ] Lighthouse score checked
- [ ] Cross-browser tested
- [ ] Mobile responsiveness verified

### General
- [ ] Domain name registered
- [ ] SSL certificate installed
- [ ] Backups configured
- [ ] Monitoring & alerts set up
- [ ] Documentation updated
- [ ] Team trained on deployment
- [ ] Rollback plan in place
- [ ] Disaster recovery plan ready

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:5432/database_name
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
SECRET_KEY=your-secret-key-here
```

### Frontend (.env.production)
```
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=HRMS Lite
VITE_VERSION=1.0.0
```

---

## Database Backup

### PostgreSQL Backup
```bash
# Create backup
pg_dump -U hrms_user -d hrms_db > backup.sql

# Restore backup
psql -U hrms_user -d hrms_db < backup.sql
```

### Automated Backup
```bash
# Create cron job (runs daily at 2 AM)
0 2 * * * /usr/local/bin/backup.sh

# Create /usr/local/bin/backup.sh
#!/bin/bash
pg_dump -U hrms_user -d hrms_db > /backups/hrms_$(date +\%Y\%m\%d).sql
```

---

## Monitoring & Logging

### Application Logging
```python
# In backend/app/main.py
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

### Error Tracking (Sentry)
```python
import sentry_sdk

sentry_sdk.init("https://your-sentry-key@sentry.io/project-id")
```

### Performance Monitoring
- Use New Relic, DataDog, or similar services
- Monitor API response times
- Track database query performance
- Alert on errors and failures

---

## SSL/TLS Certificate

### Using Let's Encrypt with Nginx
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

### Configure in Nginx
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
}
```

---

## Performance Optimization

### Frontend
```bash
# Build with optimization
npm run build

# Check bundle size
npm install -D webpack-bundle-analyzer

# Optimize images
npm install -D imagemin-webpack-plugin
```

### Backend
```python
# Enable caching
from fastapi_cache2 import FastAPICache2
from fastapi_cache2.backends.redis import RedisBackend

# Use connection pooling
from sqlalchemy.pool import QueuePool
engine = create_engine(DATABASE_URL, poolclass=QueuePool)
```

---

## Troubleshooting Deployment

### Frontend not connecting to backend
- Check CORS configuration in backend
- Verify API URL in frontend environment
- Check browser console for errors
- Use Network tab to see API calls

### Database connection error
- Verify DATABASE_URL is correct
- Check database is running
- Verify credentials
- Check firewall/security groups

### High memory usage
- Check for memory leaks
- Optimize database queries
- Implement pagination
- Use caching

### Slow API responses
- Check database indexes
- Optimize queries
- Implement caching
- Check server resources

---

## Post-Deployment Tasks

1. **Test all features**
   - Add employees
   - Mark attendance
   - View statistics
   - Filter records

2. **Monitor logs**
   - Check for errors
   - Monitor performance
   - Track user activity

3. **Get user feedback**
   - Test with real users
   - Gather improvement suggestions
   - Fix any issues

4. **Plan maintenance**
   - Schedule regular backups
   - Plan security updates
   - Monitor performance trends

---

## Rollback Plan

### If deployment fails
```bash
# Revert to previous version
git revert HEAD
git push origin main

# Restore database backup
psql -U hrms_user -d hrms_db < backup.sql
```

---

## Scaling Considerations

### Database
- Implement read replicas
- Use connection pooling
- Optimize indexes
- Archive old data

### Application
- Use load balancer
- Deploy multiple instances
- Implement caching layer
- Use CDN for static files

### Infrastructure
- Auto-scaling groups
- Managed services (RDS, etc.)
- Global CDN
- DDoS protection

---

## Support & Help

### Deployment Issues
1. Check error logs
2. Review documentation
3. Check community forums
4. Contact platform support

### Performance Issues
1. Profile application
2. Check resource usage
3. Optimize bottlenecks
4. Consider scaling

---

## Version Control

### Deployment branches
```bash
# Development
git checkout -b develop

# Staging
git checkout -b staging

# Production
git checkout main
```

### Tag releases
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

**Your HRMS Lite application is now ready for production! 🚀**

For questions or issues, refer to the API documentation or contact support.
