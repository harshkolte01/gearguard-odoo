import { useDroppable } from '@dnd-kit/core';
import type { MaintenanceRequest } from '@/lib/types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  title: string;
  stage: 'new' | 'in_progress' | 'repaired' | 'scrap';
  requests: MaintenanceRequest[];
  onRequestClick: (request: MaintenanceRequest) => void;
  isDragDisabled?: boolean;
}

export default function KanbanColumn({ 
  title, 
  stage, 
  requests, 
  onRequestClick,
  isDragDisabled = false,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  const getStageColor = () => {
    switch (stage) {
      case 'new':
        return 'kanban-column-new';
      case 'in_progress':
        return 'kanban-column-in-progress';
      case 'repaired':
        return 'kanban-column-repaired';
      case 'scrap':
        return 'kanban-column-scrap';
      default:
        return '';
    }
  };

  return (
    <div className={`kanban-column ${getStageColor()}`}>
      <div className="kanban-column-header">
        <h3 className="kanban-column-title">{title}</h3>
        <span className="kanban-column-count">{requests.length}</span>
      </div>

      <div 
        ref={setNodeRef}
        className={`kanban-column-content ${isOver ? 'kanban-column-dragover' : ''}`}
      >
        {requests.length === 0 ? (
          <div className="kanban-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className="kanban-empty-text">No requests</p>
          </div>
        ) : (
          <div className="kanban-cards-list">
            {requests.map((request) => (
              <KanbanCard
                key={request.id}
                request={request}
                onClick={onRequestClick}
                isDragDisabled={isDragDisabled}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


