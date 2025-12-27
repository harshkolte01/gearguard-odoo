'use client';

import { useRouter } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import type { MaintenanceRequest } from '@/lib/types';

interface ScheduledRequestCardProps {
  request: MaintenanceRequest;
}

export default function ScheduledRequestCard({ request }: ScheduledRequestCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/requests/${request.id}`);
  };

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      className="scheduled-request-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="scheduled-request-header">
        <span className="scheduled-request-time">
          {formatTime(request.scheduled_date)}
        </span>
        <Badge variant={request.state} size="sm">
          {request.state.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="scheduled-request-content">
        <h4 className="scheduled-request-subject">
          {truncate(request.subject, 35)}
        </h4>
        
        {request.equipment && (
          <p className="scheduled-request-equipment">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            {truncate(request.equipment.name, 30)}
          </p>
        )}

        {request.workCenter && (
          <p className="scheduled-request-equipment">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            {truncate(request.workCenter.name, 30)}
          </p>
        )}

        {request.assignedTechnician && (
          <p className="scheduled-request-technician">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {request.assignedTechnician.name}
          </p>
        )}
      </div>

      <div className="scheduled-request-footer">
        <Badge variant={request.type} size="sm">
          {request.type.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
}


