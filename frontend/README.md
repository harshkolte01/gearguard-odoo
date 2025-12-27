# GearGuard Frontend - Authentication System

Beautiful, production-ready authentication pages for the GearGuard equipment management system.

## 🎨 Design Preview

**Aesthetic:** Industrial Minimalism with Geometric Precision

- **Split-screen layout** with animated geometric patterns
- **Floating label inputs** with smooth transitions
- **Password strength indicator** with visual feedback
- **Responsive design** from mobile to desktop
- **Muted earth tones** with rust accent colors

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**Important:** Backend must be running on `http://localhost:3001` with CORS enabled.

See [`QUICK_START.md`](QUICK_START.md) for complete setup instructions.

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (auth)/              # Authentication pages (route group)
│   │   ├── login/
│   │   │   └── page.tsx    # Login page
│   │   ├── signup/
│   │   │   └── page.tsx    # Signup page
│   │   └── forgot-password/
│   │       └── page.tsx    # Password reset page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home (redirects to login)
│   └── globals.css         # Design system
│
├── components/
│   └── ui/                 # Reusable UI components
│       ├── Input.tsx       # Floating label input
│       ├── Button.tsx      # Styled button with loading
│       └── PasswordStrength.tsx  # Password indicator
│
├── lib/
│   ├── api.ts             # API client & error handling
│   └── types.ts           # TypeScript definitions
│
└── .env.local             # Environment configuration
```

## 📄 Available Pages

| Route | Description | Features |
|-------|-------------|----------|
| `/login` | User authentication | Email/password, remember me, error handling |
| `/signup` | New user registration | Name/email/password, strength indicator, validation |
| `/forgot-password` | Password reset | Email validation, success confirmation |

## 🔧 Technology Stack

- **Next.js** 16.1.1 (App Router)
- **React** 19.2.3
- **TypeScript** Full type safety
- **Tailwind CSS** 4 + Custom CSS
- **API Integration** Native fetch wrapper

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [`QUICK_START.md`](QUICK_START.md) | Get started in 3 steps |
| [`AUTH_SETUP_GUIDE.md`](AUTH_SETUP_GUIDE.md) | Complete setup & troubleshooting |
| [`AUTH_PAGES_DOCUMENTATION.md`](AUTH_PAGES_DOCUMENTATION.md) | Technical documentation |
| [`INTEGRATION_NOTES.md`](INTEGRATION_NOTES.md) | Backend integration instructions |
| [`IMPLEMENTATION_SUMMARY.md`](IMPLEMENTATION_SUMMARY.md) | What was built |

## ✨ Key Features

### Design
- ✅ Industrial minimalism aesthetic
- ✅ Split-screen layout with geometric pattern
- ✅ Floating label inputs
- ✅ Smooth animations
- ✅ Fully responsive (mobile-first)

### Functionality
- ✅ Complete form validation (client + server)
- ✅ Password strength indicator
- ✅ JWT token management
- ✅ Comprehensive error handling
- ✅ Loading states
- ✅ Success/error messages

### Code Quality
- ✅ TypeScript type safety
- ✅ Reusable components
- ✅ Clean architecture
- ✅ Accessible UI
- ✅ Production-ready

## 🔐 Authentication Flow

```
User → Login/Signup → Validation → API Call → JWT Token → localStorage → Protected Routes
```

## 🧪 Testing

**Test User Creation:**
```
Name: John Doe
Email: test@example.com
Password: TestPass123!
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one special character (@$!%*?&)

## 🌐 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/signup` | POST | User registration |
| `/api/auth/forgot-password` | POST | Password reset request |

## 🚨 Important Notes

### Before First Run

1. **Backend CORS:** Must add CORS support to backend
   - See [`INTEGRATION_NOTES.md`](INTEGRATION_NOTES.md)
   
2. **Environment:** Configure `.env.local`
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Backend Running:** Ensure backend server is active on port 3001

## 📱 Responsive Design

- **Desktop (968px+):** Split-screen with geometric visual
- **Tablet (640-968px):** Form only, optimized spacing
- **Mobile (<640px):** Single column, touch-friendly

## 🎯 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

## 🔄 Development Workflow

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📦 What's Included

### Pages (3)
- Login page
- Signup page
- Forgot password page

### Components (3)
- Input with floating labels
- Button with loading states
- Password strength indicator

### Utilities (2)
- API client with error handling
- TypeScript type definitions

### Documentation (5)
- Quick start guide
- Setup guide
- Technical documentation
- Integration notes
- Implementation summary

## 🏆 Production Ready

This authentication system is production-ready with:

- ✅ Beautiful, distinctive design
- ✅ Robust error handling
- ✅ Full type safety
- ✅ Comprehensive validation
- ✅ Responsive design
- ✅ Accessible UI
- ✅ Complete documentation
- ✅ Tested functionality

## 🆘 Need Help?

1. **Getting Started:** [`QUICK_START.md`](QUICK_START.md)
2. **Setup Issues:** [`AUTH_SETUP_GUIDE.md`](AUTH_SETUP_GUIDE.md) → Troubleshooting section
3. **Backend Integration:** [`INTEGRATION_NOTES.md`](INTEGRATION_NOTES.md)
4. **Technical Details:** [`AUTH_PAGES_DOCUMENTATION.md`](AUTH_PAGES_DOCUMENTATION.md)

## 🎉 Ready to Use!

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000` and start authenticating! 🚀

---

**Built with:** Next.js • React • TypeScript • Tailwind CSS  
**Design System:** Industrial Minimalism  
**Status:** ✅ Production Ready
