'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/lib/contexts/ToastContext';
import { userStorage } from '@/lib/auth';
import { validateDurationHours } from '@/lib/validation';
import { api } from '@/lib/api';

interface RequestStateActionsProps {
  requestId: string;
  currentState: string;
  category?: string; // 'equipment' or 'work_center'
  onSuccess?: () => void;
  canUpdate?: boolean; // Explicit permission prop
  hasAssignedTechnician?: boolean; // Whether technician is assigned
}

export default function RequestStateActions({
  requestId,
  currentState,
  category = 'equipment',
  onSuccess,
  canUpdate = true,
  hasAssignedTechnician = false,
}: RequestStateActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDurationInput, setShowDurationInput] = useState(false);
  const [durationHours, setDurationHours] = useState('');
  const [durationError, setDurationError] = useState('');
  const [pendingAction, setPendingAction] = useState<{
    state: string;
    label: string;
  } | null>(null);
  const { showToast } = useToast();
  
  // Get current user to check role
  const user = userStorage.get();
  const userRole = user?.role || 'portal';

  const handleStateChange = async (newState: string, duration?: number) => {
    setIsLoading(true);
    
    try {
      console.log('[RequestStateActions] Updating request state:', {
        requestId,
        newState,
        duration,
        user: user?.email
      });

      const updateData: any = { state: newState };
      if (duration !== undefined) {
        updateData.duration_hours = duration;
      }

      const result = await api.updateRequestState(requestId, updateData);
      
      console.log('[RequestStateActions] Update successful:', result);
      showToast('Request status updated successfully', 'success');
      
      // Call onSuccess callback to refresh data
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('[RequestStateActions] Update failed:', error);
      
      // Extract error message from ApiError
      const errorMessage = error?.message || error?.details || 'Failed to update request status';
      
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
      setShowDurationInput(false);
      setPendingAction(null);
      setDurationHours('');
      setDurationError('');
    }
  };

  const confirmStateChange = (state: string, label: string) => {
    console.log('[RequestStateActions] Button clicked:', { state, label, requestId });
    
    // Validate technician assignment for starting work
    if (state === 'in_progress' && !hasAssignedTechnician) {
      showToast('Cannot start work: No technician is assigned to this request. Please assign a technician first.', 'error');
      return;
    }
    
    setPendingAction({ state, label });
    
    // If marking as repaired, show duration input first
    if (state === 'repaired') {
      setShowDurationInput(true);
    } else {
      setShowConfirm(true);
    }
  };

  const handleDurationSubmit = () => {
    console.log('[RequestStateActions] Validating duration:', durationHours);
    
    // Validate duration
    const validation = validateDurationHours(durationHours);
    if (!validation.isValid) {
      const errorMsg = validation.error || 'Invalid duration';
      console.log('[RequestStateActions] Duration validation failed:', errorMsg);
      setDurationError(errorMsg);
      return;
    }

    console.log('[RequestStateActions] Duration valid, showing confirmation');
    
    // Close duration input and show confirmation
    setShowDurationInput(false);
    setShowConfirm(true);
  };

  const handleCancelDuration = () => {
    setShowDurationInput(false);
    setPendingAction(null);
    setDurationHours('');
    setDurationError('');
  };

  const getAvailableActions = () => {
    switch (currentState) {
      case 'new':
        return [
          { state: 'in_progress', label: 'Start Work', variant: 'primary' as const },
          { state: 'scrap', label: 'Mark as Scrap', variant: 'secondary' as const },
        ];
      case 'in_progress':
        return [
          { state: 'repaired', label: 'Mark as Repaired', variant: 'primary' as const },
          { state: 'scrap', label: 'Mark as Scrap', variant: 'secondary' as const },
        ];
      case 'repaired':
        return [];
      case 'scrap':
        return [];
      default:
        return [];
    }
  };

  const getStatusInfo = () => {
    const isPortal = userRole === 'portal';
    
    switch (currentState) {
      case 'new':
        return {
          icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ),
          title: 'Request Pending',
          description: isPortal 
            ? 'Your maintenance request has been received and will be assigned to a technician soon.'
            : 'This request is pending assignment and ready to be started.',
          color: '#f59e0b',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        };
      case 'in_progress':
        return {
          icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          ),
          title: 'Work In Progress',
          description: isPortal
            ? 'A technician is currently working on your maintenance request.'
            : 'Maintenance work is currently being performed on this request.',
          color: '#3b82f6',
          gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        };
      case 'repaired':
        return {
          icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ),
          title: 'Completed Successfully',
          description: isPortal
            ? 'Your maintenance request has been completed and the equipment is back in service.'
            : 'Maintenance work has been successfully completed.',
          color: '#10b981',
          gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        };
      case 'scrap':
        return {
          icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          ),
          title: 'Marked as Scrap',
          description: isPortal
            ? 'This equipment has been marked for disposal and is no longer in service.'
            : 'Equipment has been evaluated and marked for disposal.',
          color: '#ef4444',
          gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        };
      default:
        return {
          icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
            </svg>
          ),
          title: 'Status Unknown',
          description: 'The current status of this request is not recognized.',
          color: '#6b7280',
          gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        };
    }
  };

  const statusInfo = getStatusInfo();
  
  // Users without update permission (portal users) OR completed/scrapped requests see status info only
  const actions = getAvailableActions();
  const shouldShowActions = canUpdate && actions.length > 0;

  if (!shouldShowActions) {
    return (
      <div className="request-status-info-enhanced">
        <div 
          className="request-status-info-icon-enhanced" 
          style={{ 
            background: statusInfo.gradient,
            boxShadow: `0 12px 28px ${statusInfo.color}35`
          }}
        >
          {statusInfo.icon}
        </div>
        <h4 className="request-status-info-title-enhanced">{statusInfo.title}</h4>
        <p className="request-status-info-description-enhanced">{statusInfo.description}</p>
        
        {/* Additional context for different roles */}
        {!canUpdate && userRole === 'portal' && (
          <div className="status-info-context">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>You'll be notified when the status changes</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Current Status Display */}
      <div className="request-current-status">
        <div className="status-badge-wrapper">
          <div 
            className="status-badge-icon"
            style={{ background: statusInfo.gradient }}
          >
            {statusInfo.icon}
          </div>
          <div className="status-badge-text">
            <span className="status-badge-label">Current Status</span>
            <span className="status-badge-value">{statusInfo.title}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="request-actions-section-divider">
        <span>Available Actions</span>
      </div>

      <div className="request-actions-buttons-enhanced">
        {actions.map((action) => {
          // Disable Start Work button if no technician assigned
          const isDisabled = isLoading || (action.state === 'in_progress' && !hasAssignedTechnician);
          
          return (
            <Button
              key={action.state}
              variant={action.variant}
              fullWidth
              onClick={() => confirmStateChange(action.state, action.label)}
              disabled={isDisabled}
              className="action-button-enhanced"
            >
              {action.label}
            </Button>
          );
        })}
      </div>
      
      <div className="request-actions-help">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="request-actions-help-text">
          {!hasAssignedTechnician && currentState === 'new'
            ? '⚠️ A technician must be assigned before work can be started on this request.'
            : userRole === 'admin' || userRole === 'manager' 
              ? 'Update request status at any stage of maintenance.' 
              : 'Update status as you work on this maintenance task.'}
        </p>
      </div>

      {/* Duration Input Modal for Repaired State */}
      {showDurationInput && pendingAction && (
        <Modal isOpen={showDurationInput} onClose={handleCancelDuration} title="Enter Work Duration" size="md">
          <div style={{ padding: '1.5rem 0' }}>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              Please enter the total hours spent on this maintenance work.
            </p>
            <Input
              label="Duration (hours) *"
              type="number"
              value={durationHours}
              onChange={(e) => {
                setDurationHours(e.target.value);
                if (durationError) setDurationError('');
              }}
              error={durationError}
              placeholder="e.g., 2.5"
              min="0"
              step="0.1"
              helperText="Enter the time spent in hours (e.g., 2.5 for 2 hours 30 minutes)"
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <Button
                variant="ghost"
                onClick={handleCancelDuration}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDurationSubmit}
              >
                Continue
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showConfirm && pendingAction && (
        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => {
            setShowConfirm(false);
            setPendingAction(null);
            setDurationHours('');
            setDurationError('');
          }}
          onConfirm={() => handleStateChange(
            pendingAction.state,
            pendingAction.state === 'repaired' ? parseFloat(durationHours) : undefined
          )}
          title={`Confirm ${pendingAction.label}`}
          message={
            pendingAction.state === 'scrap'
              ? '⚠️ Warning: Marking this request as scrap indicates the issue cannot be resolved or the equipment/facility is beyond repair. If this request has associated equipment, it will be automatically marked as "scrapped" in the system. This action cannot be easily reversed. Are you sure you want to proceed?'
              : pendingAction.state === 'repaired' && durationHours
              ? `Are you sure you want to mark this request as repaired with ${durationHours} hours of work?`
              : `Are you sure you want to change the request status to "${pendingAction.label}"?`
          }
          confirmText="Confirm"
          cancelText="Cancel"
          isLoading={isLoading}
        />
      )}
    </>
  );
}
