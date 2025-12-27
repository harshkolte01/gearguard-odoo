'use client';

import { useTechnicians } from '@/lib/hooks/useCalendar';
import type { User } from '@/lib/types';

interface TechnicianFilterProps {
  user: User;
  selectedTechnicianId: string | null;
  onTechnicianChange: (technicianId: string | null) => void;
}

export default function TechnicianFilter({
  user,
  selectedTechnicianId,
  onTechnicianChange,
}: TechnicianFilterProps) {
  const { technicians, loading } = useTechnicians();

  // Only show filter for managers and admins
  if (user.role !== 'admin' && user.role !== 'manager') {
    return null;
  }

  return (
    <div className="technician-filter">
      <label htmlFor="technician-select" className="technician-filter-label">
        Filter by Technician:
      </label>
      
      <select
        id="technician-select"
        className="technician-filter-select"
        value={selectedTechnicianId || ''}
        onChange={(e) => onTechnicianChange(e.target.value || null)}
        disabled={loading}
      >
        <option value="">All Technicians</option>
        {technicians.map((tech) => (
          <option key={tech.id} value={tech.id}>
            {tech.name}
          </option>
        ))}
      </select>
    </div>
  );
}


