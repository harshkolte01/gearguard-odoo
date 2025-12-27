# Backend Integration Notes

## Required Backend Setup

To enable the frontend authentication pages to communicate with the backend, you need to add CORS support.

### Option 1: Install CORS Package (Recommended)

1. **Install the CORS package:**
```bash
cd backend
npm install cors
```

2. **Update `backend/app.js`:**

Add at the top with other requires:
```javascript
const cors = require('cors');
```

Add after `const app = express();` and before middleware:
```javascript
// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
```

### Option 2: Manual CORS Headers

If you prefer not to install the CORS package, add this middleware to `backend/app.js`:

```javascript
// Manual CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
```

### Complete Example (backend/app.js)

```javascript
const express = require('express');
const cors = require('cors'); // Add this
const authRoutes = require('./routes/auth.routes');

const app = express();

// CORS Configuration - Add this
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Middleware
app.use(express.json());

// Home endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GearGuard API' });
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

module.exports = app;
```

## Verification Steps

After adding CORS:

1. **Restart the backend server:**
```bash
cd backend
npm run dev
```

2. **Start the frontend:**
```bash
cd frontend
npm run dev
```

3. **Test the integration:**
   - Navigate to `http://localhost:3000`
   - Try to sign up with a new account
   - Check browser console for any CORS errors
   - Verify successful API communication

## Production CORS Configuration

For production, update the CORS origin to your actual domain:

```javascript
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  credentials: true,
}));
```

## Common CORS Issues

### Issue: "No 'Access-Control-Allow-Origin' header"
**Solution:** Ensure CORS middleware is added before routes

### Issue: Credentials not working
**Solution:** Set `credentials: true` in CORS config and ensure frontend sends credentials

### Issue: Preflight requests failing
**Solution:** Ensure OPTIONS method is handled (CORS package does this automatically)

## Current Backend Status

✅ Express server configured
✅ Authentication routes defined
✅ Validation middleware working
✅ Prisma database connected
✅ JWT authentication implemented

⚠️ **Action Required:** Add CORS support using one of the options above

## Testing Checklist

After CORS setup:

- [ ] Backend starts without errors
- [ ] Frontend can reach backend API
- [ ] Signup creates new user
- [ ] Login returns JWT token
- [ ] Forgot password validates email
- [ ] No CORS errors in browser console
- [ ] All validation errors display correctly
- [ ] Success messages show properly

## Contact

If you encounter any issues with the integration, refer to:
- `AUTH_SETUP_GUIDE.md` - Frontend setup
- `AUTH_PAGES_DOCUMENTATION.md` - Detailed documentation
- `backend/AUTH_API_DOCUMENTATION.md` - Backend API documentation

