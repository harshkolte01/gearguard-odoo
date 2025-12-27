'use client';

import { useRouter } from 'next/navigation';

interface MaintenanceSmartButtonProps {
  equipmentId: string;
  maintenanceRequests?: Array<{ state: string; id: string }>;
  className?: string;
}

export default function MaintenanceSmartButton({
  equipmentId,
  maintenanceRequests = [],
  className = ''
}: MaintenanceSmartButtonProps) {
  const router = useRouter();
  
  // Calculate open requests count (new + in_progress)
  const openRequestsCount = maintenanceRequests.filter(
    req => req.state === 'new' || req.state === 'in_progress'
  ).length;
  
  const handleClick = () => {
    // Navigate to dashboard with equipment filter
    const params = new URLSearchParams({
      equipment_id: equipmentId,
      state: 'new,in_progress'
    });
    router.push(`/?${params.toString()}`);
  };
  
  return (
    <button 
      className={`equipment-smart-button ${className}`}
      onClick={handleClick}
      title={`View ${openRequestsCount} open maintenance request${openRequestsCount !== 1 ? 's' : ''}`}
      aria-label={`View maintenance requests for this equipment`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
      <div className="smart-button-content">
        <span className="smart-button-label">Maintenance</span>
        <span className="smart-button-badge">{openRequestsCount}</span>
      </div>
    </button>
  );
}


