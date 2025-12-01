# 🏗️ Brock Platform - Architecture Documentation

## 📐 System Architecture

### **Tech Stack**
```
Frontend:  Next.js 15 (App Router) + React 19 + TypeScript
Styling:   Tailwind CSS v4 + Framer Motion
Backend:   Next.js API Routes (Server-side)
Database:  Turso (Distributed SQLite)
ORM:       Drizzle ORM
Hosting:   Vercel / VPS / Shared Hosting
```

---

## 🗂️ Project Structure

```
brock-platform/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Homepage
│   │   ├── layout.tsx                # Root layout (header, footer)
│   │   ├── globals.css               # Global styles
│   │   │
│   │   ├── about/                    # About page
│   │   ├── blog/                     # Blog (placeholder)
│   │   ├── calculators/              # Financial calculators
│   │   ├── careers/                  # Careers (placeholder)
│   │   ├── contact/                  # Contact page
│   │   ├── press/                    # Press (placeholder)
│   │   ├── programs/                 # Programs (List/Refer/Affiliate)
│   │   │
│   │   ├── properties/               # Property listings
│   │   │   ├── page.tsx              # Property grid/search
│   │   │   └── [id]/                 # Property detail page
│   │   │       └── page.tsx
│   │   │
│   │   ├── admin/                    # Admin dashboard
│   │   │   ├── page.tsx              # Property management
│   │   │   └── inquiries/            # Inquiry management
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                      # Backend API Routes
│   │       ├── properties/           # Property CRUD
│   │       │   └── route.ts
│   │       ├── buy-inquiries/        # Buy inquiries
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── rent-inquiries/       # Rent inquiries
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── contact-inquiries/    # Contact inquiries
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       └── listing-submissions/  # Property submissions
│   │           ├── route.ts
│   │           └── [id]/route.ts
│   │
│   ├── components/                   # React components
│   │   ├── header.tsx                # Global header
│   │   ├── footer.tsx                # Global footer
│   │   ├── floating-dock.tsx         # Floating navigation
│   │   └── ui/                       # Shadcn UI components
│   │
│   ├── db/                           # Database layer
│   │   ├── index.ts                  # Drizzle client
│   │   ├── schema.ts                 # Database schema
│   │   └── seeds/                    # Seed data
│   │       └── properties.ts
│   │
│   ├── lib/                          # Utilities
│   │   └── utils.ts                  # Helper functions
│   │
│   └── hooks/                        # Custom React hooks
│
├── public/                           # Static assets
│   ├── brock-logo.svg                # Logo
│   ├── favicon.ico                   # Favicon
│   └── brock-landing.html            # Static landing page
│
├── drizzle/                          # Database migrations
│   └── meta/
│
├── .env                              # Environment variables (local)
├── .env.example                      # Environment template
├── .env.production                   # Production env vars
├── drizzle.config.ts                 # Drizzle ORM config
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
├── ecosystem.config.js               # PM2 config (production)
├── nginx.conf                        # Nginx config (VPS)
├── .htaccess                         # Apache config (shared hosting)
├── DEPLOYMENT.md                     # Deployment guide
└── README-ARCHITECTURE.md            # This file
```

---

## 🔌 API Architecture

### **RESTful API Endpoints**

All endpoints follow REST conventions:

#### **Properties API** (`/api/properties`)
```
GET    /api/properties              # List all properties (paginated)
GET    /api/properties?id=1         # Get single property
POST   /api/properties              # Create property (Admin)
PUT    /api/properties?id=1         # Update property (Admin)
DELETE /api/properties?id=1         # Delete property (Admin)
```

**Query Parameters**:
- `limit` (default: 10, max: 100) - Results per page
- `offset` (default: 0) - Pagination offset
- `search` - Search in title, location, description
- `availableFor` - Filter by `buy`, `rent`, or `both`

**Example Request**:
```bash
curl https://yourdomain.com/api/properties?search=Mumbai&availableFor=buy&limit=20
```

#### **Buy Inquiries API** (`/api/buy-inquiries`)
```
GET    /api/buy-inquiries           # List all buy inquiries
POST   /api/buy-inquiries           # Submit buy inquiry
GET    /api/buy-inquiries/[id]      # Get single inquiry
DELETE /api/buy-inquiries/[id]      # Delete inquiry
```

#### **Rent Inquiries API** (`/api/rent-inquiries`)
```
GET    /api/rent-inquiries          # List all rent inquiries
POST   /api/rent-inquiries          # Submit rent inquiry
GET    /api/rent-inquiries/[id]     # Get single inquiry
DELETE /api/rent-inquiries/[id]     # Delete inquiry
```

#### **Contact Inquiries API** (`/api/contact-inquiries`)
```
GET    /api/contact-inquiries       # List all contact inquiries
POST   /api/contact-inquiries       # Submit contact inquiry
GET    /api/contact-inquiries/[id]  # Get single inquiry
DELETE /api/contact-inquiries/[id]  # Delete inquiry
```

#### **Listing Submissions API** (`/api/listing-submissions`)
```
GET    /api/listing-submissions     # List all submissions
POST   /api/listing-submissions     # Submit property listing
PUT    /api/listing-submissions/[id] # Update submission status
DELETE /api/listing-submissions/[id] # Delete submission
```

---

## 🗄️ Database Schema

### **Properties Table**
```sql
CREATE TABLE properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image TEXT NOT NULL,                 -- Main property image URL
  price TEXT NOT NULL,                 -- Display price (e.g., "₹1.5 Cr")
  price_value INTEGER NOT NULL,        -- Numeric price for sorting
  title TEXT NOT NULL,                 -- Property title
  location TEXT NOT NULL,              -- City/area
  beds INTEGER NOT NULL,               -- Number of bedrooms
  baths INTEGER NOT NULL,              -- Number of bathrooms
  sqft INTEGER NOT NULL,               -- Square footage
  available_for TEXT NOT NULL DEFAULT 'buy',  -- 'buy', 'rent', 'both'
  description TEXT,                    -- Long description
  amenities TEXT,                      -- JSON array of amenities
  gallery TEXT,                        -- JSON array of image URLs
  categories TEXT,                     -- Property categories/tags
  created_at TEXT NOT NULL,            -- ISO timestamp
  updated_at TEXT NOT NULL             -- ISO timestamp
);
```

### **Contact Inquiries Table**
```sql
CREATE TABLE contact_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

### **Buy Inquiries Table**
```sql
CREATE TABLE buy_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  property_title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  budget TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

### **Rent Inquiries Table**
```sql
CREATE TABLE rent_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  property_title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  move_in_date TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

### **Listing Submissions Table**
```sql
CREATE TABLE listing_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  property_type TEXT NOT NULL,
  location TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
  created_at TEXT NOT NULL
);
```

---

## 🔄 Data Flow

### **User Views Property Listings**
```
User Browser → Next.js Page (properties/page.tsx)
            → useEffect() triggers API call
            → fetch('/api/properties')
            → API Route (route.ts)
            → Drizzle ORM
            → Turso Database (Edge Network)
            → Returns JSON data
            → React renders property cards
```

### **User Submits Inquiry**
```
User fills form → onClick handler
              → fetch('/api/buy-inquiries', { method: 'POST', body })
              → API Route validates data
              → Drizzle ORM inserts record
              → Turso Database stores inquiry
              → Returns success response
              → Toast notification shown
```

### **Admin Manages Properties**
```
Admin Dashboard → Loads properties from API
               → Admin edits property
               → PUT request to /api/properties?id=X
               → API validates and updates
               → Turso Database updated
               → UI refreshes with new data
```

---

## 🚀 Performance Optimizations

### **Frontend**
- ✅ Next.js Image optimization (WebP/AVIF)
- ✅ Code splitting (automatic with Next.js)
- ✅ React.memo for expensive components
- ✅ useCallback for stable function references
- ✅ useMemo for computed values
- ✅ Lazy loading for images
- ✅ Framer Motion animations (GPU-accelerated)
- ✅ Tailwind CSS (purged unused styles)

### **Backend**
- ✅ Turso edge caching (sub-10ms latency)
- ✅ Database indexes on frequently queried fields
- ✅ Pagination to limit result sets
- ✅ Input validation to prevent malicious queries
- ✅ Error handling for graceful failures

### **Deployment**
- ✅ Vercel Edge Network (global CDN)
- ✅ Automatic HTTPS
- ✅ Gzip/Brotli compression
- ✅ Browser caching headers
- ✅ PM2 cluster mode (multi-core utilization)

---

## 🔒 Security Measures

### **API Security**
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention (Drizzle ORM parameterized queries)
- ✅ CORS configuration
- ✅ Rate limiting (Vercel automatic)
- ⚠️ **TODO**: Implement authentication for admin routes

### **Database Security**
- ✅ Environment variables for credentials
- ✅ Turso auth token authentication
- ✅ Read-only production access
- ✅ Automatic backups

### **Frontend Security**
- ✅ XSS prevention (React auto-escaping)
- ✅ HTTPS-only in production
- ✅ Security headers (X-Frame-Options, etc.)
- ✅ Input sanitization on forms

---

## 📈 Scalability Considerations

### **Current Capacity**
- **Database**: Turso handles millions of rows
- **API**: Serverless scales automatically
- **Frontend**: Next.js ISR for static pages

### **Future Scaling**
1. **Add Redis caching** for frequently accessed properties
2. **Implement CDN** for property images (Cloudinary, Imgix)
3. **Add search engine** (Algolia, Elasticsearch) for advanced filtering
4. **Implement authentication** (NextAuth.js) for admin dashboard
5. **Add analytics** (Vercel Analytics, Google Analytics)
6. **Set up monitoring** (Sentry for error tracking)

---

## 🧪 Testing Strategy

### **Manual Testing**
```bash
# Test API endpoints
curl http://localhost:3000/api/properties
curl http://localhost:3000/api/properties?id=1
curl -X POST http://localhost:3000/api/contact-inquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"1234567890","message":"Test inquiry"}'
```

### **Load Testing** (Recommended)
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test API performance
ab -n 1000 -c 10 http://localhost:3000/api/properties
```

---

## 🛠️ Maintenance Checklist

### **Weekly**
- [ ] Check server logs for errors
- [ ] Monitor database storage usage
- [ ] Review inquiry submissions

### **Monthly**
- [ ] Update npm dependencies: `npm outdated && npm update`
- [ ] Review and optimize slow database queries
- [ ] Backup database (Turso auto-backups, but good to verify)
- [ ] Check SSL certificate expiry

### **Quarterly**
- [ ] Performance audit (Lighthouse, WebPageTest)
- [ ] Security audit (npm audit fix)
- [ ] Review and archive old inquiries
- [ ] Update content (blog, properties)

---

## 📊 Monitoring & Analytics

### **Recommended Tools**
1. **Vercel Analytics** - Real-time performance metrics
2. **Google Analytics** - User behavior tracking
3. **Sentry** - Error tracking and monitoring
4. **LogRocket** - Session replay for debugging
5. **Turso Dashboard** - Database query performance

### **Key Metrics to Track**
- Page load time (aim for <3s)
- API response time (aim for <500ms)
- Database query time (aim for <100ms)
- Conversion rate (inquiries per visitor)
- Bounce rate (aim for <50%)

---

## 🎯 Roadmap & Future Features

### **Phase 1 (Current)** ✅
- Property listings
- Search and filters
- Inquiry forms
- Admin dashboard
- Financial calculators

### **Phase 2 (Planned)**
- User authentication (buyer/seller accounts)
- Saved properties/favorites
- Email notifications
- Advanced search (map view, price range slider)
- Property comparison tool

### **Phase 3 (Future)**
- Virtual tours (3D/360°)
- In-app messaging between buyers/sellers
- Payment integration for bookings
- Mobile app (React Native)
- AI-powered property recommendations

---

## 📞 Developer Support

### **Documentation Links**
- Next.js: https://nextjs.org/docs
- Drizzle ORM: https://orm.drizzle.team/docs
- Turso: https://docs.turso.tech
- Tailwind CSS: https://tailwindcss.com/docs
- Shadcn UI: https://ui.shadcn.com

### **Common Commands**
```bash
# Development
npm run dev                    # Start dev server

# Production
npm run build                  # Build for production
npm start                      # Start production server

# Database
npx drizzle-kit generate       # Generate migrations
npx drizzle-kit push           # Push schema to database
npx drizzle-kit studio         # Open Drizzle Studio GUI

# Deployment
vercel                         # Deploy to Vercel
pm2 start ecosystem.config.js  # Deploy with PM2
```

---

**Built with ❤️ for Brock Real Estate Platform**
