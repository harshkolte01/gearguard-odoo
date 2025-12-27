# GearGuard Authentication Setup Guide

## Quick Start

### Prerequisites
- Node.js 20+ installed
- Backend server running on `http://localhost:3001`
- PostgreSQL database configured

### Installation Steps

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment**

Create `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### First-Time Setup

1. Navigate to `http://localhost:3000` (auto-redirects to login)
2. Click "Sign up" to create a new account
3. Fill in the registration form:
   - Full Name (min 2 characters)
   - Email (valid format)
   - Password (min 8 chars, uppercase, lowercase, special character)
   - Confirm Password
   - Accept Terms & Conditions
4. After successful registration, you'll be redirected to login
5. Log in with your credentials

## Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home page (redirects to `/login`) |
| `/login` | User login page |
| `/signup` | New user registration |
| `/forgot-password` | Password reset request |

## Backend API Endpoints

Ensure these endpoints are accessible:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/signup` | POST | New user registration |
| `/api/auth/forgot-password` | POST | Password reset request |

## Testing the System

### Test User Creation

1. **Valid Registration:**
```
Name: John Doe
Email: john@example.com
Password: SecurePass123!
```

2. **Login with New Account:**
```
Email: john@example.com
Password: SecurePass123!
```

### Test Error Scenarios

1. **Duplicate Email:**
   - Try registering with an existing email
   - Should show: "An account with this email already exists"

2. **Invalid Login:**
   - Try logging in with non-existent email
   - Should show: "Account does not exist"
   - Try logging in with wrong password
   - Should show: "Invalid password"

3. **Weak Password:**
   - Try registering with "weak123"
   - Should show password validation error

4. **Forgot Password:**
   - Enter registered email
   - Should show success message
   - Enter non-existent email
   - Should show "No account found"

## Common Issues

### 1. API Connection Failed

**Symptom:** "Network error. Please check your connection."

**Solutions:**
- Verify backend is running: `curl http://localhost:3001/`
- Check `.env.local` has correct API URL
- Ensure no CORS issues (backend should allow frontend origin)

### 2. CORS Error

**Symptom:** Console shows CORS policy error

**Solution:** Add CORS middleware to backend:
```javascript
// backend/app.js
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));
```

### 3. Form Validation Not Working

**Symptom:** Forms submit without validation

**Solution:** 
- Clear browser cache
- Restart dev server
- Check browser console for JavaScript errors

### 4. Styles Not Loading

**Symptom:** Pages look unstyled

**Solution:**
- Ensure `globals.css` is imported in `layout.tsx`
- Restart Next.js dev server
- Clear `.next` cache: `rm -rf .next && npm run dev`

## Backend Configuration

### Required Environment Variables (Backend)

```env
DATABASE_URL=postgresql://user:pass@host:port/database
PORT=3001
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### Database Schema

The User model should have:
```prisma
model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  password_hash String
  role          Role
  created_at    DateTime @default(now())
}

enum Role {
  admin
  manager
  technician
  portal
}
```

### Run Database Migrations

```bash
cd backend
npx prisma generate
npx prisma db push
```

## Development Workflow

### 1. Start Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:3001
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### 3. Make Changes
- Edit files in `app/`, `components/`, or `lib/`
- Changes hot-reload automatically
- Check browser console for errors

### 4. Test Changes
- Test all three auth pages
- Verify API integration
- Check responsive design
- Test error scenarios

## Production Deployment

### Frontend

1. **Update Environment Variables**
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

2. **Build for Production**
```bash
npm run build
npm start
```

3. **Deploy to Vercel/Netlify**
- Push to GitHub
- Connect repository
- Set environment variables
- Deploy

### Backend

1. **Set Production Environment**
```env
NODE_ENV=production
DATABASE_URL=<production_db_url>
JWT_SECRET=<strong_random_secret>
```

2. **Security Checklist**
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Use httpOnly cookies for tokens
- [ ] Enable rate limiting
- [ ] Set up error logging
- [ ] Configure security headers

## File Structure Reference

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/
│       ├── Input.tsx
│       ├── Button.tsx
│       └── PasswordStrength.tsx
├── lib/
│   ├── api.ts
│   └── types.ts
├── .env.local
├── package.json
└── AUTH_PAGES_DOCUMENTATION.md
```

## Next Steps

After authentication is working:

1. **Create Protected Routes:** Add middleware to check JWT token
2. **Build Dashboard:** Create post-login landing page
3. **User Profile:** Add profile management
4. **Complete Password Reset:** Build reset token validation
5. **Email Integration:** Set up email service for notifications

## Support

- **Documentation:** See `AUTH_PAGES_DOCUMENTATION.md` for detailed info
- **Backend API:** See `backend/AUTH_API_DOCUMENTATION.md`
- **Issues:** Check troubleshooting section above

## Technology Stack

- **Framework:** Next.js 16.1.1
- **React:** 19.2.3
- **Styling:** Tailwind CSS 4 + Custom CSS
- **TypeScript:** Full type safety
- **API Client:** Native fetch with custom wrapper

## Key Features

✅ Production-ready authentication pages
✅ Beautiful industrial minimalist design
✅ Full form validation (client + server)
✅ Comprehensive error handling
✅ Responsive design (mobile-first)
✅ Password strength indicator
✅ JWT token management
✅ TypeScript type safety
✅ Accessible UI components
✅ Smooth animations
✅ SEO-friendly metadata

Ready to build! 🚀

