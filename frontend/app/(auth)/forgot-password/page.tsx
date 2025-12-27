'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authApi, ApiError } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authApi.forgotPassword({ email });

      if (response.success) {
        setSuccessMessage(response.message || 'Password reset instructions sent to your email');
        setIsSubmitted(true);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 404) {
          setGeneralError('No account found with this email address.');
        } else if (error.errors) {
          const emailError = error.errors.find(err => err.field === 'email');
          if (emailError) {
            setError(emailError.message);
          } else {
            setGeneralError(error.message || 'Failed to send reset instructions.');
          }
        } else {
          setGeneralError(error.message || 'Failed to send reset instructions.');
        }
      } else {
        setGeneralError('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setSuccessMessage('');
    setEmail('');
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

          {!isSubmitted ? (
            <>
              <h1 className="auth-title">Reset Password</h1>
              <p className="auth-subtitle">
                Enter your email address and we'll send you instructions to reset your password
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                  disabled={isLoading}
                  helperText="We'll send password reset instructions to this email"
                />

                <Button type="submit" fullWidth isLoading={isLoading}>
                  Send Reset Instructions
                </Button>

                <div className="auth-footer">
                  <Link href="/login" className="auth-link">
                    ← Back to login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth-title">Check Your Email</h1>
              <p className="auth-subtitle">
                We've sent password reset instructions to your email address
              </p>

              <div className="alert alert-success">
                {successMessage}
              </div>

              <div style={{ marginTop: '2rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  If you don't see the email in your inbox, please check your spam folder. 
                  The link will expire in 24 hours for security reasons.
                </p>

                <Button variant="ghost" fullWidth onClick={handleTryAgain}>
                  Try Another Email
                </Button>

                <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
                  <Link href="/login" className="auth-link">
                    ← Back to login
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

