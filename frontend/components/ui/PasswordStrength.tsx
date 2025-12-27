'use client';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = () => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    // Determine label and color
    if (score <= 2) return { score: 1, label: 'Weak', color: '#dc2626' };
    if (score <= 4) return { score: 2, label: 'Fair', color: '#f59e0b' };
    if (score <= 5) return { score: 3, label: 'Good', color: '#10b981' };
    return { score: 4, label: 'Strong', color: '#059669' };
  };

  const strength = getStrength();
  
  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="password-strength-bars">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`strength-bar ${level <= strength.score ? 'active' : ''}`}
            style={{
              backgroundColor: level <= strength.score ? strength.color : undefined,
            }}
          />
        ))}
      </div>
      <span className="password-strength-label" style={{ color: strength.color }}>
        {strength.label}
      </span>
    </div>
  );
}

