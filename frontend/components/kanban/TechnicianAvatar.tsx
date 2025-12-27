import type { Technician } from '@/lib/types';

interface TechnicianAvatarProps {
  technician?: {
    id: string;
    name: string;
    email: string;
  } | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function TechnicianAvatar({ technician, size = 'md' }: TechnicianAvatarProps) {
  const sizeClasses = {
    sm: 'technician-avatar-sm',
    md: 'technician-avatar-md',
    lg: 'technician-avatar-lg',
  };

  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (!technician) {
    return (
      <div className={`technician-avatar technician-avatar-empty ${sizeClasses[size]}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    );
  }

  return (
    <div 
      className={`technician-avatar ${sizeClasses[size]}`}
      title={`${technician.name} (${technician.email})`}
    >
      <span className="technician-avatar-initials">
        {getInitials(technician.name)}
      </span>
    </div>
  );
}


