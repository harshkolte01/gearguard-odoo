import { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import type { MaintenanceRequest } from '@/lib/types';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { useUpdateRequestState } from '@/lib/hooks/useDashboard';

interface KanbanBoardProps {
  requests: MaintenanceRequest[];
  loading?: boolean;
  onRequestClick: (request: MaintenanceRequest) => void;
  userRole?: 'admin' | 'manager' | 'technician' | 'portal';
  onRefetch: () => void;
}

export default function KanbanBoard({ 
  requests, 
  loading, 
  onRequestClick, 
  userRole,
  onRefetch,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { updateState, loading: updating } = useUpdateRequestState();

  // Disable drag for portal users
  const isDragDisabled = userRole === 'portal' || updating;

  // Group requests by state
  const groupedRequests = useMemo(() => {
    return {
      new: requests.filter(r => r.state === 'new'),
      in_progress: requests.filter(r => r.state === 'in_progress'),
      repaired: requests.filter(r => r.state === 'repaired'),
      scrap: requests.filter(r => r.state === 'scrap'),
    };
  }, [requests]);

  const activeRequest = useMemo(() => {
    if (!activeId) return null;
    return requests.find(r => r.id === activeId);
  }, [activeId, requests]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setErrorMessage(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const requestId = active.id as string;
    const newState = over.id as string;

    // Find the request
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Don't update if dropped in the same column
    if (request.state === newState) return;

    // Validation: Cannot move to in_progress without assigned technician
    if (newState === 'in_progress' && !request.assignedTechnician) {
      setErrorMessage('Cannot start work: A technician must be assigned before work can begin');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    // Validation: Cannot move to scrap if it's a work center request
    if (newState === 'scrap' && request.category === 'work_center') {
      setErrorMessage('Cannot mark as scrap: Only equipment maintenance requests can be scrapped');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    // Validation: Cannot move to repaired without duration (backend will handle this)
    if (newState === 'repaired') {
      setErrorMessage('Cannot mark as repaired: Please use the request detail page to specify duration hours');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    try {
      await updateState(requestId, newState);
      onRefetch(); // Refetch to get updated data
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update request state');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="kanban-board-loading">
        <div className="spinner" />
        <p>Loading requests...</p>
      </div>
    );
  }

  return (
    <>
      {errorMessage && (
        <div className="kanban-error-toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <DndContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          <KanbanColumn
            title="New"
            stage="new"
            requests={groupedRequests.new}
            onRequestClick={onRequestClick}
            isDragDisabled={isDragDisabled}
          />
          <KanbanColumn
            title="In Progress"
            stage="in_progress"
            requests={groupedRequests.in_progress}
            onRequestClick={onRequestClick}
            isDragDisabled={isDragDisabled}
          />
          <KanbanColumn
            title="Repaired"
            stage="repaired"
            requests={groupedRequests.repaired}
            onRequestClick={onRequestClick}
            isDragDisabled={isDragDisabled}
          />
          <KanbanColumn
            title="Scrap"
            stage="scrap"
            requests={groupedRequests.scrap}
            onRequestClick={onRequestClick}
            isDragDisabled={isDragDisabled}
          />
        </div>

        <DragOverlay>
          {activeRequest ? (
            <KanbanCard
              request={activeRequest}
              onClick={() => {}}
              isDragDisabled={false}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}


