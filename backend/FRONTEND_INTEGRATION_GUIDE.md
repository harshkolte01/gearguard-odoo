# Frontend Integration Guide

Quick reference for integrating the authentication endpoints with your frontend.

## Base URL
```
http://localhost:3001/api/auth
```

## 1. Signup Flow

```javascript
async function handleSignup(name, email, password) {
  try {
    const response = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!data.success) {
      // Handle errors
      if (data.message) {
        // Single error message
        alert(data.message); // "Email Id should not be a duplicate in database"
      } else if (data.errors) {
        // Validation errors array
        data.errors.forEach(err => {
          console.error(`${err.field}: ${err.message}`);
        });
      }
      return;
    }

    // Success - redirect to login
    alert('Account created successfully! Please login.');
    window.location.href = '/login';
    
  } catch (error) {
    console.error('Signup error:', error);
    alert('Server error. Please try again.');
  }
}
```

## 2. Login Flow

```javascript
async function handleLogin(email, password) {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!data.success) {
      // Show specific error message
      alert(data.message); // "Account not exist" or "Invalid Password"
      return;
    }

    // Success - store token and redirect
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    window.location.href = '/dashboard';
    
  } catch (error) {
    console.error('Login error:', error);
    alert('Server error. Please try again.');
  }
}
```

## 3. Forgot Password Flow

```javascript
async function handleForgotPassword(email) {
  try {
    const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message); // "Account not exist"
      return;
    }

    // Success
    alert('Password reset instructions sent to your email');
    window.location.href = '/login';
    
  } catch (error) {
    console.error('Forgot password error:', error);
    alert('Server error. Please try again.');
  }
}
```

## 4. Using the Auth Token

After login, use the token for authenticated requests:

```javascript
async function makeAuthenticatedRequest(url) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  return response.json();
}
```

## 5. Logout

```javascript
function handleLogout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

## 6. Get Current User

```javascript
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Usage
const user = getCurrentUser();
if (user) {
  console.log(`Welcome ${user.name}!`);
  console.log(`Role: ${user.role}`);
}
```

## Error Messages Reference

### Signup Errors
- `"Email Id should not be a duplicate in database"` - Email already exists
- `"Password must be at least 8 characters long"` - Weak password
- `"Password must contain at least one uppercase letter, one lowercase letter, and one special character"` - Password doesn't meet requirements

### Login Errors
- `"Account not exist"` - Email not found (404)
- `"Invalid Password"` - Wrong password (401)

### Forgot Password Errors
- `"Account not exist"` - Email not found

## Password Requirements

Show these to users on the signup form:
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one special character (@$!%*?&)

## Example Password Validator (Client-side)

```javascript
function validatePassword(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return errors;
}

// Usage
const passwordErrors = validatePassword('weak');
if (passwordErrors.length > 0) {
  passwordErrors.forEach(err => console.error(err));
}
```

## React Example

### Signup Component

```jsx
import { useState } from 'react';

function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || data.errors.map(e => e.message).join(', '));
        return;
      }

      // Success
      alert('Account created successfully!');
      window.location.href = '/login';
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### Login Component

```jsx
import { useState } from 'react';

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      // Store token and user
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      
      <button type="submit">Login</button>
      <a href="/forgot-password">Forget Password?</a>
    </form>
  );
}
```

## Testing the API

You can test the endpoints using your browser console:

```javascript
// Test Signup
fetch('http://localhost:3001/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass@123'
  })
}).then(r => r.json()).then(console.log);

// Test Login
fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'TestPass@123'
  })
}).then(r => r.json()).then(console.log);
```

## CORS Note

If you encounter CORS errors, make sure the backend has CORS enabled for your frontend domain. The backend team may need to add:

```javascript
// backend/app.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

## Need Help?

Contact the backend team if you encounter any issues!

