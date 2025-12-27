'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authApi, tokenStorage, ApiError } from '@/lib/api';
import { userStorage } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.token && response.user) {
        tokenStorage.set(response.token);
        userStorage.set(response.user);
        // Redirect to home page
        router.push('/');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 404) {
          setGeneralError('Account does not exist. Please sign up.');
        } else if (error.statusCode === 401) {
          setErrors({ password: 'Invalid password' });
        } else if (error.errors) {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setGeneralError(error.message || 'Login failed. Please try again.');
        }
      } else {
        setGeneralError('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-visual">
        <div className="geometric-pattern">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="geometric-block" />
          ))}
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-logo">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              GEARGUARD
            </h2>
          </div>

          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to access your equipment management dashboard
          </p>

          {generalError && (
            <div className="alert alert-error">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              disabled={isLoading}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>

              <Link href="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Sign In
            </Button>

            <div className="auth-footer">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="auth-link">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

