import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { MaintenanceRequest } from '@/lib/types';
import TechnicianAvatar from './TechnicianAvatar';

interface KanbanCardProps {
  request: MaintenanceRequest;
  onClick: (request: MaintenanceRequest) => void;
  isDragDisabled?: boolean;
}

export default function KanbanCard({ request, onClick, isDragDisabled = false }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: request.id,
    disabled: isDragDisabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  // Check if request is overdue
  const isOverdue = request.scheduled_date 
    ? new Date(request.scheduled_date) < new Date() && request.state !== 'repaired' && request.state !== 'scrap'
    : false;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getEquipmentInfo = () => {
    if (request.category === 'equipment' && request.equipment) {
      return {
        name: request.equipment.name,
        detail: `Serial: ${request.equipment.serial_number}`,
      };
    } else if (request.category === 'work_center' && request.workCenter) {
      return {
        name: request.workCenter.name,
        detail: request.workCenter.code ? `Code: ${request.workCenter.code}` : 'Work Center',
      };
    }
    return {
      name: 'Not specified',
      detail: '',
    };
  };

  const equipmentInfo = getEquipmentInfo();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`kanban-card ${isDragging ? 'kanban-card-dragging' : ''} ${isOverdue ? 'kanban-card-overdue' : ''}`}
      onClick={(e) => {
        if (!isDragging) {
          onClick(request);
        }
      }}
    >
      {isOverdue && <div className="kanban-card-overdue-strip" />}
      
      <div className="kanban-card-header">
        <h4 className="kanban-card-title">{request.subject}</h4>
        <span className={`kanban-card-type type-badge-${request.type}`}>
          {request.type === 'corrective' ? 'C' : 'P'}
        </span>
      </div>

      {request.description && (
        <p className="kanban-card-description">
          {request.description.length > 80 
            ? `${request.description.substring(0, 80)}...` 
            : request.description}
        </p>
      )}

      <div className="kanban-card-equipment">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
        <div>
          <span className="kanban-card-equipment-name">{equipmentInfo.name}</span>
          {equipmentInfo.detail && (
            <span className="kanban-card-equipment-detail">{equipmentInfo.detail}</span>
          )}
        </div>
      </div>

      <div className="kanban-card-footer">
        <div className="kanban-card-technician">
          <TechnicianAvatar technician={request.assignedTechnician} size="sm" />
          <span className="kanban-card-technician-name">
            {request.assignedTechnician?.name || 'Unassigned'}
          </span>
        </div>
        
        {request.scheduled_date && (
          <div className={`kanban-card-date ${isOverdue ? 'kanban-card-date-overdue' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{formatDate(request.scheduled_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}


