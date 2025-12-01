# 🚀 Brock Platform - Production Deployment Guide

## ✅ Current Production Stack

### **Backend Architecture**
- **Type**: Dedicated API Routes (Next.js App Router)
- **Location**: `src/app/api/` directory
- **Routes**: 
  - `/api/properties` - Property CRUD operations
  - `/api/buy-inquiries` - Buy inquiry management
  - `/api/rent-inquiries` - Rent inquiry management
  - `/api/contact-inquiries` - Contact form submissions
  - `/api/listing-submissions` - Property listing submissions

### **Database**
- **Provider**: Turso (Production-grade distributed SQLite)
- **Type**: Cloud-hosted, edge-distributed database
- **Features**:
  - ✅ Global edge replication
  - ✅ Automatic backups
  - ✅ High availability
  - ✅ Low latency worldwide
  - ✅ PostgreSQL-compatible syntax
- **Connection**: Configured via `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN`

---

## 📦 Deployment Options

### **Option 1: Vercel (Recommended)**

Vercel is the easiest and most optimized for Next.js:

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add:
     - `TURSO_CONNECTION_URL` = `libsql://db-c7394b47-4167-4aa1-a62e-76fce545a399-orchids.aws-us-west-2.turso.io`
     - `TURSO_AUTH_TOKEN` = Your Turso auth token
     - `NODE_ENV` = `production`

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

**Pricing**: Free tier includes:
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- Serverless functions

---

### **Option 2: Shared Hosting (cPanel/Plesk)**

For traditional shared hosting with Node.js support:

#### **Prerequisites**
Your host must support:
- Node.js 18+ (check with hosting provider)
- npm or yarn
- SSH access (for deployment)

#### **Step 1: Build the Application**
```bash
npm run build
```

This creates:
- `.next/` folder (optimized production build)
- `public/` folder (static assets)

#### **Step 2: Upload Files via FTP/SSH**

Upload these files/folders:
```
├── .next/              (entire folder)
├── public/             (entire folder)
├── node_modules/       (optional - better to install on server)
├── package.json
├── package-lock.json
├── next.config.ts
├── .env.production     (with your environment variables)
└── drizzle.config.ts
```

#### **Step 3: Install Dependencies on Server**
```bash
ssh your-server.com
cd /path/to/your/app
npm install --production
```

#### **Step 4: Start the Application**

**Using PM2 (Recommended)**:
```bash
npm install -g pm2
pm2 start npm --name "brock" -- start
pm2 save
pm2 startup
```

**Or using a custom start script**:
```bash
node_modules/.bin/next start -p 3000
```

#### **Step 5: Configure Reverse Proxy**

**Apache (.htaccess)**:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
</IfModule>
```

**Nginx**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### **Option 3: VPS/Cloud Server (DigitalOcean, AWS, etc.)**

#### **Step 1: Provision Server**
- Ubuntu 22.04 LTS (recommended)
- Minimum 1GB RAM
- Node.js 18+ installed

#### **Step 2: Clone Repository**
```bash
git clone your-repo-url
cd brock-platform
```

#### **Step 3: Install Dependencies**
```bash
npm install
```

#### **Step 4: Set Environment Variables**
```bash
nano .env.production
```

Add:
```env
NODE_ENV=production
TURSO_CONNECTION_URL=your_turso_url
TURSO_AUTH_TOKEN=your_turso_token
```

#### **Step 5: Build and Start**
```bash
npm run build
pm2 start npm --name "brock" -- start
pm2 startup
pm2 save
```

#### **Step 6: Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/brock
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/brock /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### **Step 7: SSL Certificate (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🔐 Environment Variables

Create `.env.production` with:

```env
# Database Configuration
TURSO_CONNECTION_URL=libsql://db-c7394b47-4167-4aa1-a62e-76fce545a399-orchids.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token_here

# Application
NODE_ENV=production
```

**Security Note**: Never commit `.env` files to Git. Use `.env.example` for templates.

---

## 📊 Performance Optimizations

### **Already Implemented**:
✅ Next.js Image optimization
✅ Memoized components with `React.memo`
✅ `useCallback` for stable function references
✅ `useMemo` for computed values
✅ Lazy loading for images
✅ Code splitting
✅ Turso edge caching

### **Additional Recommendations**:

1. **Enable Compression** (if not using Vercel):
   ```javascript
   // In next.config.ts
   compress: true,
   ```

2. **CDN for Static Assets**:
   - Upload images to Cloudinary, Imgur, or Supabase Storage
   - Update image URLs in database

3. **Database Indexing**:
   ```sql
   -- Add indexes for frequently queried fields
   CREATE INDEX idx_location ON properties(location);
   CREATE INDEX idx_available_for ON properties(available_for);
   CREATE INDEX idx_price_value ON properties(price_value);
   ```

---

## 🧪 Testing Production Build Locally

```bash
# Build
npm run build

# Test production build
npm start

# Visit http://localhost:3000
```

---

## 📈 Monitoring & Maintenance

### **Health Checks**
```bash
# Check if app is running
curl http://localhost:3000/api/properties

# PM2 monitoring
pm2 monit
pm2 logs brock
```

### **Database Monitoring**
- Turso Dashboard: https://turso.tech/app
- Monitor query performance
- Check storage usage

### **Backup Strategy**
Turso handles automatic backups, but you can also:
```bash
# Export database snapshot
npx drizzle-kit pull:sqlite
```

---

## 🚨 Troubleshooting

### **Build Errors**
```bash
# Clear cache
rm -rf .next
npm run build
```

### **Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### **Database Connection Issues**
- Verify `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN`
- Check network connectivity
- Verify Turso service status

### **Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] API routes responding correctly
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Application running with PM2/systemd
- [ ] Monitoring setup (optional: Sentry, LogRocket)
- [ ] Backup strategy verified
- [ ] Performance tested (Lighthouse, WebPageTest)

---

## 🎯 Production URLs

After deployment, your APIs will be available at:
- `https://yourdomain.com/api/properties`
- `https://yourdomain.com/api/buy-inquiries`
- `https://yourdomain.com/api/rent-inquiries`
- `https://yourdomain.com/api/contact-inquiries`
- `https://yourdomain.com/api/listing-submissions`

---

## 📞 Support

For issues:
1. Check server logs: `pm2 logs brock`
2. Review Turso dashboard for database issues
3. Test APIs with Postman or curl
4. Check Next.js documentation: https://nextjs.org/docs

---

**Your Brock platform is production-ready!** 🎉
