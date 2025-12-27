'use client';

import type { AdminStats } from '@/lib/types';

interface AdminStatsProps {
  stats: AdminStats;
}

export default function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="admin-stats-grid">
      <div className="admin-stat-card">
        <div className="admin-stat-icon technician">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="admin-stat-content">
          <div className="admin-stat-value">{stats.totalTechnicians}</div>
          <div className="admin-stat-label">Total Technicians</div>
        </div>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-icon manager">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="17 11 19 13 23 9" />
          </svg>
        </div>
        <div className="admin-stat-content">
          <div className="admin-stat-value">{stats.totalManagers}</div>
          <div className="admin-stat-label">Total Managers</div>
        </div>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-icon team">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="admin-stat-content">
          <div className="admin-stat-value">{stats.activeTeams}</div>
          <div className="admin-stat-label">Active Teams</div>
        </div>
      </div>

      <div className="admin-stat-card">
        <div className={`admin-stat-icon unassigned ${stats.unassignedTechnicians > 0 ? 'alert' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="admin-stat-content">
          <div className={`admin-stat-value ${stats.unassignedTechnicians > 0 ? 'alert' : ''}`}>
            {stats.unassignedTechnicians}
          </div>
          <div className="admin-stat-label">Unassigned Users</div>
        </div>
      </div>
    </div>
  );
}


