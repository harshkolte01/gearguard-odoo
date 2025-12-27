'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant:
    | 'new'
    | 'in_progress'
    | 'repaired'
    | 'scrap'
    | 'corrective'
    | 'preventive'
    | 'default';
  size?: 'sm' | 'md' | 'lg';
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>
      {children}
    </span>
  );
}

