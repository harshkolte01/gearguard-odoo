# Authentication Pages Documentation

## Overview

This documentation covers the authentication system implementation for GearGuard, featuring three production-ready pages: Login, Signup, and Forgot Password.

## Design Philosophy

**Industrial Minimalism with Geometric Precision**
- Muted earth tones with industrial accents
- Asymmetric split-screen layout
- Floating label inputs with validation states
- Subtle animations and micro-interactions
- Fully responsive design

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/                    # Route group for auth pages
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── signup/
│   │   │   └── page.tsx          # Signup page
│   │   └── forgot-password/
│   │       └── page.tsx          # Forgot password page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home (redirects to login)
│   └── globals.css               # Design system styles
├── components/
│   └── ui/
│       ├── Input.tsx             # Reusable input component
│       ├── Button.tsx            # Reusable button component
│       └── PasswordStrength.tsx  # Password strength indicator
├── lib/
│   ├── api.ts                    # API client with error handling
│   └── types.ts                  # TypeScript type definitions
└── .env.local                    # Environment configuration
```

## Pages

### 1. Login Page (`/login`)

**Features:**
- Email and password authentication
- Remember me checkbox (UI only)
- Form validation with real-time feedback
- Error handling for specific backend responses:
  - 404: "Account does not exist"
  - 401: "Invalid password"
- Success flow stores JWT token in localStorage
- Links to signup and forgot password pages

**API Integration:**
- Endpoint: `POST /api/auth/login`
- Request: `{ email, password }`
- Response: `{ success, message, token, user }`

### 2. Signup Page (`/signup`)

**Features:**
- Full name, email, password, confirm password fields
- Real-time password strength indicator
- Terms and conditions checkbox
- Comprehensive validation:
  - Name: min 2 characters
  - Email: valid format
  - Password: min 8 chars, uppercase, lowercase, special character
  - Confirm password: must match
- Handles duplicate email errors
- Success flow redirects to login after 2 seconds
- Link to login page

**API Integration:**
- Endpoint: `POST /api/auth/signup`
- Request: `{ name, email, password }`
- Response: `{ success, message, user }`

### 3. Forgot Password Page (`/forgot-password`)

**Features:**
- Email input with validation
- Two-state UI:
  1. Email submission form
  2. Success confirmation screen
- Error handling for non-existent accounts
- Helpful instructions about checking spam folder
- "Try another email" option
- Link back to login

**API Integration:**
- Endpoint: `POST /api/auth/forgot-password`
- Request: `{ email }`
- Response: `{ success, message, email }`

## Components

### Input Component

Floating label input with validation states and animations.

**Props:**
- `label` (string): Input label text
- `error` (string): Error message to display
- `helperText` (string): Helper text below input
- Standard HTML input attributes

**Features:**
- Floating label animation on focus/value
- Error state styling
- Smooth transitions
- Accessible markup

### Button Component

Styled button with loading states and variants.

**Props:**
- `variant` ('primary' | 'secondary' | 'ghost'): Button style
- `isLoading` (boolean): Shows spinner when true
- `fullWidth` (boolean): Full-width button
- Standard HTML button attributes

**Features:**
- Hover effects with gradient shimmer
- Loading state with spinner
- Disabled state handling
- Three style variants

### Password Strength Component

Visual indicator for password strength.

**Props:**
- `password` (string): Password to evaluate

**Features:**
- 4-level strength indicator (Weak, Fair, Good, Strong)
- Color-coded bars
- Checks for:
  - Length (8+, 12+ characters)
  - Lowercase letters
  - Uppercase letters
  - Numbers
  - Special characters

## API Client

**Location:** `lib/api.ts`

### Features
- Centralized API configuration
- Typed request/response handlers
- Custom error class with status codes
- Token storage utilities
- Network error handling

### API Methods
```typescript
authApi.login({ email, password })
authApi.signup({ name, email, password })
authApi.forgotPassword({ email })
```

### Token Storage
```typescript
tokenStorage.set(token)    // Store JWT
tokenStorage.get()         // Retrieve JWT
tokenStorage.remove()      // Clear JWT
```

### Error Handling
```typescript
try {
  await authApi.login(credentials);
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.statusCode);
    console.log(error.errors);
  }
}
```

## Styling System

**Location:** `app/globals.css`

### CSS Variables
```css
--bg-primary: #f5f5f0
--bg-secondary: #2a2a2a
--accent-rust: #b85c38
--text-primary: #1a1a1a
--border-subtle: #e0e0dc
```

### Animations
- `fadeInUp`: Entrance animation
- `slideInRight`: Form element reveals
- `spin`: Loading spinner

### Responsive Breakpoints
- Desktop: 968px and above (split-screen)
- Tablet: 640px to 968px (form only)
- Mobile: Below 640px (optimized spacing)

## Environment Configuration

**File:** `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Change this to your production API URL when deploying.

## Form Validation

### Client-Side Validation

All forms validate before API submission:

**Login:**
- Email format validation
- Required fields check

**Signup:**
- Name: min 2 characters
- Email: valid format
- Password: 8+ chars, uppercase, lowercase, special char
- Confirm password: match validation
- Terms acceptance required

**Forgot Password:**
- Email format validation
- Required field check

### Server-Side Validation

Backend returns structured error responses:

```typescript
{
  success: false,
  errors: [
    { field: "email", message: "Please provide a valid email" }
  ]
}
```

Form displays field-specific errors inline.

## User Experience Flow

1. **First Visit:** User lands on home page → redirects to `/login`
2. **New User:** Login → "Sign up" link → Signup form → Success → Redirects to login
3. **Existing User:** Login → Success → Stores token → Can redirect to dashboard
4. **Forgot Password:** Login → "Forgot password?" → Email submission → Confirmation screen

## Authentication Flow

```
1. User submits credentials
2. Frontend validates form
3. API request to backend
4. Backend validates and processes
5. Success: JWT token returned
6. Frontend stores token in localStorage
7. User redirected to protected route
```

## Error Handling Strategy

### Network Errors
```typescript
catch (error) {
  if (!(error instanceof ApiError)) {
    // Network error - show connection message
  }
}
```

### API Errors
- Status 400: Validation errors → Show field errors
- Status 401: Invalid credentials → Show specific message
- Status 404: Account not found → Helpful message
- Status 500: Server error → Generic error message

### Display Strategy
- Field errors: Inline below inputs
- General errors: Alert banner at top
- Success messages: Green alert banner

## Accessibility

- Semantic HTML elements
- Proper label associations
- Keyboard navigation support
- Focus states on all interactive elements
- ARIA attributes where appropriate
- High contrast text

## Performance

- Client-side validation reduces API calls
- Optimized animations (CSS only)
- Minimal bundle size
- No external dependencies beyond Next.js
- Lazy loading for routes

## Security Considerations

- JWT stored in localStorage (consider httpOnly cookies for production)
- CORS configuration required on backend
- Password requirements enforced client and server
- No sensitive data in URL parameters
- XSS protection via React's built-in escaping

## Testing Checklist

### Manual Testing
- [ ] Login with valid credentials
- [ ] Login with invalid email (404 error)
- [ ] Login with invalid password (401 error)
- [ ] Signup with new email
- [ ] Signup with duplicate email
- [ ] Signup with weak password
- [ ] Password strength indicator updates correctly
- [ ] Forgot password with existing email
- [ ] Forgot password with non-existent email
- [ ] All form validations trigger correctly
- [ ] Navigation links work
- [ ] Responsive design on mobile
- [ ] Loading states prevent double submission
- [ ] Success messages display correctly

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

### Responsive Testing
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1920px)

## Future Enhancements

1. **Email Verification:** Send confirmation email after signup
2. **Reset Password:** Complete flow with token validation
3. **Social Login:** OAuth integration
4. **Two-Factor Authentication:** TOTP or SMS
5. **Session Management:** Refresh tokens
6. **Password Visibility Toggle:** Eye icon for password fields
7. **Auto-logout:** Session timeout
8. **Remember Device:** Trusted device storage

## Troubleshooting

### Issue: API requests fail with CORS error
**Solution:** Add CORS middleware in backend:
```javascript
app.use(cors({ origin: 'http://localhost:3000' }));
```

### Issue: Forms not submitting
**Solution:** Check browser console for validation errors

### Issue: Styles not loading
**Solution:** Restart dev server: `npm run dev`

### Issue: Token not persisting
**Solution:** Check localStorage in browser dev tools

## Deployment Notes

1. Update `NEXT_PUBLIC_API_URL` in production environment
2. Configure proper CORS origins on backend
3. Use httpOnly cookies instead of localStorage for tokens
4. Enable HTTPS in production
5. Set up proper error logging
6. Configure rate limiting on authentication endpoints
7. Add reCAPTCHA or similar bot protection

## Contact & Support

For issues or questions, refer to the main GearGuard documentation or contact the development team.

