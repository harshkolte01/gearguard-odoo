'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PasswordStrength from '@/components/ui/PasswordStrength';
import { authApi, ApiError } from '@/lib/api';
import AuthVisual from '@/components/auth/AuthVisual';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and special character';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authApi.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        setSuccessMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.message.includes('duplicate')) {
          setGeneralError('An account with this email already exists. Please login instead.');
        } else if (error.errors) {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setGeneralError(error.message || 'Registration failed. Please try again.');
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
      <AuthVisual />

      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4L4 10V22L16 28L28 22V10L16 4Z" stroke="var(--accent-rust)" strokeWidth="2.5" strokeLinejoin="round"/>
              <circle cx="16" cy="16" r="4" fill="var(--accent-rust)"/>
            </svg>
            <h2>GEARGUARD</h2>
          </div>

          <h1 className="auth-title">Join Us</h1>
          <p className="auth-subtitle">
            Create your account and start managing equipment like a pro
          </p>

          {generalError && (
            <div className="alert alert-error">
              {generalError}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                disabled={isLoading}
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                disabled={isLoading}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                disabled={isLoading}
              />
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10 }}>
                <PasswordStrength password={formData.password} />
              </div>
            </div>

            <div style={{ marginTop: '2.5rem' }}>
              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                disabled={isLoading}
              />
            </div>

            <div className="checkbox-wrapper" style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                disabled={isLoading}
              />
              <label htmlFor="acceptTerms">
                I agree to the{' '}
                <a href="#" className="auth-link" onClick={(e) => e.preventDefault()}>
                  Terms and Conditions
                </a>
              </label>
            </div>
            {errors.acceptTerms && (
              <span className="input-error-text" style={{ marginTop: '-1rem', marginBottom: '1rem', display: 'block' }}>
                {errors.acceptTerms}
              </span>
            )}

            <Button type="submit" fullWidth isLoading={isLoading} style={{ height: '3.5rem', fontSize: '1rem', fontWeight: 700 }}>
              Create Account
            </Button>

            <div className="auth-footer">
              Already have an account?{' '}
              <Link href="/login" className="auth-link">
                Sign in
              </Link>
            </div>
          </form>

          <div style={{ marginTop: 'auto', paddingTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            &copy; 2025 GearGuard Industrial Systems. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

