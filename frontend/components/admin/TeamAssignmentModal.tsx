'use client';

import { useState, useEffect } from 'react';
import type { TechnicianDetail, AdminTeam } from '@/lib/types';

interface TeamAssignmentModalProps {
  isOpen: boolean;
  technician: TechnicianDetail | null;
  teams: AdminTeam[];
  onClose: () => void;
  onSubmit: (technicianId: string, teamIds: string[]) => Promise<void>;
}

export default function TeamAssignmentModal({
  isOpen,
  technician,
  teams,
  onClose,
  onSubmit,
}: TeamAssignmentModalProps) {
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize selected teams when technician changes
  useEffect(() => {
    if (technician) {
      setSelectedTeamIds(technician.teams.map((team) => team.id));
    }
  }, [technician]);

  const handleToggleTeam = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!technician) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(technician.id, selectedTeamIds);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update team assignments');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen || !technician) return null;

  const hasChanges =
    JSON.stringify([...selectedTeamIds].sort()) !==
    JSON.stringify([...technician.teams.map((t) => t.id)].sort());

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Assign Teams</h2>
            <p className="modal-subtitle">
              {technician.name} ({technician.email})
            </p>
          </div>
          <button
            onClick={handleClose}
            className="modal-close"
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="team-assignment-info">
            <p>
              Select the teams this {technician.role} should be assigned to.
              Selected: <strong>{selectedTeamIds.length}</strong> of {teams.length}
            </p>
          </div>

          <div className="team-assignment-list">
            {teams.length === 0 ? (
              <div className="team-assignment-empty">
                <p>No teams available</p>
                <p className="text-muted">Teams must be created before assigning them to technicians.</p>
              </div>
            ) : (
              teams.map((team) => {
                const isSelected = selectedTeamIds.includes(team.id);
                return (
                  <label
                    key={team.id}
                    className={`team-assignment-item ${isSelected ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleTeam(team.id)}
                      disabled={isSubmitting}
                      className="team-assignment-checkbox"
                    />
                    <div className="team-assignment-details">
                      <div className="team-assignment-name">{team.name}</div>
                      <div className="team-assignment-meta">
                        {team.memberCount} {team.memberCount === 1 ? 'member' : 'members'}
                      </div>
                    </div>
                    <div className="team-assignment-indicator">
                      {isSelected && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </label>
                );
              })
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !hasChanges || teams.length === 0}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner spinner-sm"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


