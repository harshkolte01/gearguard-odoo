'use client';

import { useState } from 'react';
import type { TechnicianDetail } from '@/lib/types';

interface TechnicianTableProps {
  technicians: TechnicianDetail[];
  loading?: boolean;
  onAssignTeams: (technician: TechnicianDetail) => void;
  onViewDetails: (technician: TechnicianDetail) => void;
}

export default function TechnicianTable({
  technicians,
  loading = false,
  onAssignTeams,
  onViewDetails,
}: TechnicianTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'technician' | 'manager'>('all');

  const filteredTechnicians = technicians.filter((tech) => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || tech.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'manager':
        return 'role-badge role-manager';
      case 'technician':
        return 'role-badge role-technician';
      default:
        return 'role-badge';
    }
  };

  if (loading) {
    return (
      <div className="admin-table-container">
        <div className="admin-table-loading">
          <div className="spinner"></div>
          <p>Loading technicians...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <div className="admin-table-search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-table-search-input"
          />
        </div>
        <div className="admin-table-filters">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'technician' | 'manager')}
            className="admin-table-filter-select"
          >
            <option value="all">All Roles</option>
            <option value="technician">Technicians</option>
            <option value="manager">Managers</option>
          </select>
        </div>
      </div>

      {filteredTechnicians.length === 0 ? (
        <div className="admin-table-empty">
          <p>No technicians found</p>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="btn btn-ghost">
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Teams</th>
                <th>Assigned Requests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTechnicians.map((tech) => (
                <tr key={tech.id}>
                  <td>
                    <div className="tech-name">{tech.name}</div>
                  </td>
                  <td>
                    <div className="tech-email">{tech.email}</div>
                  </td>
                  <td>
                    <span className={getRoleBadgeClass(tech.role)}>
                      {tech.role}
                    </span>
                  </td>
                  <td>
                    <div className="team-badges">
                      {tech.teams.length === 0 ? (
                        <span className="team-badge-empty">No teams</span>
                      ) : (
                        tech.teams.map((team) => (
                          <span key={team.id} className="team-badge">
                            {team.name}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="tech-requests">
                      {tech.assignedRequestsCount || 0}
                    </div>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        onClick={() => onAssignTeams(tech)}
                        className="btn btn-sm btn-secondary"
                        title="Assign Teams"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Teams
                      </button>
                      <button
                        onClick={() => onViewDetails(tech)}
                        className="btn btn-sm btn-ghost"
                        title="View Details"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


