'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/lib/contexts/ToastContext';
import { api } from '@/lib/api';
import type { Team, MaintenanceRequest } from '@/lib/types';

interface AssignTechnicianSectionProps {
  request: MaintenanceRequest;
  userRole: 'admin' | 'manager' | 'technician' | 'portal';
  onSuccess: () => void;
}

export default function AssignTechnicianSection({
  request,
  userRole,
  onSuccess,
}: AssignTechnicianSectionProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showToast } = useToast();

  // Only admin and manager can assign technicians
  const canAssign = userRole === 'admin' || userRole === 'manager';

  useEffect(() => {
    if (canAssign && request.team?.id) {
      fetchTeams();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAssign, request.team?.id]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await api.getTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      showToast('Failed to load team members', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedTechnicianId) return;

    setIsAssigning(true);
    try {
      await api.updateRequestState(request.id, {
        state: request.state, // Keep current state
        assigned_technician_id: selectedTechnicianId,
      });

      showToast('Technician assigned successfully', 'success');
      setShowConfirm(false);
      setSelectedTechnicianId('');
      onSuccess(); // Refresh request data
    } catch (error) {
      console.error('Failed to assign technician:', error);
      const errorMessage = (error as Error)?.message || 'Failed to assign technician';
      showToast(errorMessage, 'error');
    } finally {
      setIsAssigning(false);
    }
  };

  // Don't show if user doesn't have permission
  if (!canAssign) {
    return null;
  }

  // Don't show if no team assigned
  if (!request.team?.id) {
    return null;
  }

  // Get team members (technicians and managers from this request's team)
  const requestTeam = teams.find(team => team.id === request.team?.id);
  const availableTechnicians = requestTeam?.members.filter(
    member => member.role === 'technician' || member.role === 'manager'
  ) || [];

  // Get selected technician info
  const selectedTechnician = availableTechnicians.find(
    tech => tech.id === selectedTechnicianId
  );

  const currentTechnicianId = request.assignedTechnician?.id;

  return (
    <div className="assign-technician-section">
      <div className="assign-technician-card">
        <div className="assign-technician-header">
          <div className="assign-technician-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h4 className="assign-technician-title">
            {currentTechnicianId ? 'Reassign Technician' : 'Assign Technician'}
          </h4>
        </div>

        {loading ? (
          <div className="assign-technician-loading">
            <div className="loading-spinner-small" />
            <span>Loading team members...</span>
          </div>
        ) : availableTechnicians.length === 0 ? (
          <div className="assign-technician-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>No technicians available in {request.team.name}</p>
          </div>
        ) : (
          <>
            <div className="assign-technician-info">
              <p className="assign-technician-description">
                {currentTechnicianId 
                  ? `Select a different technician from ${request.team.name} to reassign this request.`
                  : `Select a technician from ${request.team.name} to assign this request.`
                }
              </p>
              <div className="assign-technician-count">
                {availableTechnicians.length} {availableTechnicians.length === 1 ? 'technician' : 'technicians'} available
              </div>
            </div>

            <div className="assign-technician-form">
              <Select
                label="Select Technician"
                options={availableTechnicians.map(tech => ({
                  value: tech.id,
                  label: `${tech.name} (${tech.email})`,
                }))}
                value={selectedTechnicianId}
                onChange={setSelectedTechnicianId}
                placeholder="Choose a technician..."
                searchable
              />

              <div className="assign-technician-actions">
                <Button
                  variant="primary"
                  onClick={() => setShowConfirm(true)}
                  disabled={!selectedTechnicianId || selectedTechnicianId === currentTechnicianId}
                  fullWidth
                >
                  {currentTechnicianId ? 'Reassign Technician' : 'Assign Technician'}
                </Button>
              </div>

              {selectedTechnicianId && selectedTechnicianId === currentTechnicianId && (
                <div className="assign-technician-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>This technician is already assigned to this request</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleAssign}
        title={currentTechnicianId ? 'Confirm Reassignment' : 'Confirm Assignment'}
        message={
          currentTechnicianId
            ? `Are you sure you want to reassign this request from ${request.assignedTechnician?.name} to ${selectedTechnician?.name}?`
            : `Are you sure you want to assign this request to ${selectedTechnician?.name}?`
        }
        confirmText={currentTechnicianId ? 'Reassign' : 'Assign'}
        cancelText="Cancel"
        isLoading={isAssigning}
      />
    </div>
  );
}

