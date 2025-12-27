import type { DashboardKPIs } from '@/lib/types';
import { User } from '@/lib/types';

interface KPICardsProps {
  data: DashboardKPIs;
  user: User;
}

export default function KPICards({ data, user }: KPICardsProps) {
  const { criticalEquipment, technicianLoad, openRequests, myRequests } = data;

  // Portal users only see "My Requests"
  if (user.role === 'portal' && myRequests) {
    return (
      <div className="kpi-grid kpi-grid-single">
        <div className="kpi-card kpi-card-neutral">
          <div className="kpi-header">
            <h3 className="kpi-title">My Requests</h3>
          </div>
          <div className="kpi-content">
            <div className="kpi-main-stat">
              <span className="kpi-value">{myRequests.total}</span>
              <span className="kpi-label">Total Requests</span>
            </div>
            <div className="kpi-breakdown">
              <div className="kpi-breakdown-item">
                <span className="kpi-breakdown-value">{myRequests.new}</span>
                <span className="kpi-breakdown-label">New</span>
              </div>
              <div className="kpi-breakdown-item">
                <span className="kpi-breakdown-value">{myRequests.in_progress}</span>
                <span className="kpi-breakdown-label">In Progress</span>
              </div>
              <div className="kpi-breakdown-item">
                <span className="kpi-breakdown-value">{myRequests.completed}</span>
                <span className="kpi-breakdown-label">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin, Manager, Technician view
  return (
    <div className="kpi-grid kpi-grid-three">
      {/* Critical Equipment */}
      {criticalEquipment && (
        <div className={`kpi-card ${criticalEquipment.count > 0 ? 'kpi-card-critical' : 'kpi-card-success'}`}>
          <div className="kpi-header">
            <h3 className="kpi-title">Critical Equipment</h3>
            {criticalEquipment.teamOnly && (
              <span className="kpi-badge">Team Only</span>
            )}
          </div>
          <div className="kpi-content">
            <div className="kpi-main-stat">
              <span className="kpi-value">{criticalEquipment.count}</span>
              <span className="kpi-label">Units</span>
            </div>
            <div className="kpi-description">
              {criticalEquipment.description || `Health < ${criticalEquipment.threshold}%`}
            </div>
          </div>
        </div>
      )}

      {/* Technician Load */}
      {technicianLoad && (
        <div
          className={`kpi-card ${
            technicianLoad.status === 'high'
              ? 'kpi-card-warning'
              : technicianLoad.status === 'medium'
              ? 'kpi-card-info'
              : 'kpi-card-success'
          }`}
        >
          <div className="kpi-header">
            <h3 className="kpi-title">Technician Load</h3>
            <span className={`kpi-status kpi-status-${technicianLoad.status}`}>
              {technicianLoad.status.toUpperCase()}
            </span>
          </div>
          <div className="kpi-content">
            <div className="kpi-main-stat">
              <span className="kpi-value">{technicianLoad.percentage}%</span>
              <span className="kpi-label">Average Load</span>
            </div>
            <div className="kpi-description">
              {technicianLoad.description || 'Assign Carefully'}
            </div>
            {technicianLoad.myLoad !== undefined && technicianLoad.teamAverage !== undefined && (
              <div className="kpi-detail">
                <span>My Load: {technicianLoad.myLoad}%</span>
                <span className="kpi-separator">|</span>
                <span>Team Avg: {technicianLoad.teamAverage}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Open Requests */}
      {openRequests && (
        <div className="kpi-card kpi-card-requests">
          <div className="kpi-header">
            <h3 className="kpi-title">Open Requests</h3>
            {openRequests.teamOnly && (
              <span className="kpi-badge">Team Only</span>
            )}
          </div>
          <div className="kpi-content">
            <div className="kpi-stats-row">
              <div className="kpi-stat-item">
                <span className="kpi-value">{openRequests.pending}</span>
                <span className="kpi-label">Pending</span>
              </div>
              <div className="kpi-stat-divider"></div>
              <div className="kpi-stat-item">
                <span className="kpi-value kpi-value-danger">{openRequests.overdue}</span>
                <span className="kpi-label">Overdue</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


