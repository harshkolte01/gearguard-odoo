# 🚀 Quick Start - GearGuard Authentication

## Start in 3 Steps

### 1️⃣ Add CORS to Backend

**Option A - Using CORS Package (Recommended):**
```bash
cd backend
npm install cors
```

Add to `backend/app.js` (after line 4):
```javascript
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
```

**Option B - Manual Headers:**
Add to `backend/app.js` (after line 4):
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
```

### 2️⃣ Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# ✓ Server running on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# ✓ App running on http://localhost:3000
```

### 3️⃣ Test It

1. Open browser: `http://localhost:3000`
2. Click "Sign up"
3. Create account (password needs: 8+ chars, uppercase, lowercase, special char)
4. Login with new credentials

## 📍 Routes

- `/` → Auto-redirects to login
- `/login` → Sign in page
- `/signup` → Create account
- `/forgot-password` → Reset password

## ⚡ Quick Test

**Valid Test User:**
```
Name: John Doe
Email: test@example.com
Password: TestPass123!
```

## 🔧 Troubleshooting

**CORS Error?**
→ Install cors package in backend

**Can't connect to API?**
→ Ensure backend is running on port 3001

**Validation errors?**
→ Password needs: 8+ chars, A-Z, a-z, @$!%*?&

## 📚 Full Documentation

- **Setup Guide:** `AUTH_SETUP_GUIDE.md`
- **Technical Docs:** `AUTH_PAGES_DOCUMENTATION.md`
- **Integration:** `INTEGRATION_NOTES.md`
- **Summary:** `IMPLEMENTATION_SUMMARY.md`

## ✅ What's Included

✨ Login page with JWT authentication
✨ Signup page with password strength indicator
✨ Forgot password page with success flow
✨ Beautiful Industrial Minimalism design
✨ Full responsive design (mobile → desktop)
✨ Comprehensive error handling
✨ TypeScript type safety
✨ Production-ready code

---

**Need help?** Check the full documentation files above or the troubleshooting section in `AUTH_SETUP_GUIDE.md`

