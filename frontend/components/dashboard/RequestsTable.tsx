import { MaintenanceRequest } from '@/lib/types';
import { SkeletonRequestsTable } from '@/components/ui/Skeleton';

interface RequestsTableProps {
  requests: MaintenanceRequest[];
  loading?: boolean;
  onRequestClick?: (request: MaintenanceRequest) => void;
  userRole?: 'admin' | 'manager' | 'technician' | 'portal';
}

function getStateBadgeClass(state: string): string {
  switch (state) {
    case 'new':
      return 'badge-new';
    case 'in_progress':
      return 'badge-in-progress';
    case 'repaired':
      return 'badge-repaired';
    case 'scrap':
      return 'badge-scrap';
    default:
      return 'badge-default';
  }
}

function getStateLabel(state: string): string {
  switch (state) {
    case 'new':
      return 'New';
    case 'in_progress':
      return 'In Progress';
    case 'repaired':
      return 'Repaired';
    case 'scrap':
      return 'Scrap';
    default:
      return state;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RequestsTable({ requests, loading, onRequestClick, userRole }: RequestsTableProps) {
  if (loading) {
    return <SkeletonRequestsTable rows={5} />;
  }

  if (!requests || requests.length === 0) {
    const isPortalUser = userRole === 'portal';
    
    return (
      <div className="requests-table-container">
        <div className="table-empty">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            style={{ color: 'var(--text-tertiary)', opacity: 0.6 }}
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p className="empty-title">
            {isPortalUser ? 'No Requests Yet' : 'No Maintenance Requests Found'}
          </p>
          <p className="empty-text">
            {isPortalUser 
              ? 'Create your first maintenance request to track equipment issues and get them resolved'
              : 'Try adjusting your filters or create a new maintenance request'
            }
          </p>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create New Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="requests-table-container">
      <div className="requests-table-wrapper">
        <table className="requests-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>For</th>
              <th>Technician</th>
              <th>Type</th>
              <th>Stage</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className="table-row"
                onClick={() => onRequestClick && onRequestClick(request)}
              >
                <td className="table-cell-subject">
                  <div className="cell-content">
                    <span className="subject-text">{request.subject}</span>
                    {request.description && (
                      <span className="subject-description">{request.description}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    {request.category === 'equipment' && request.equipment ? (
                      <>
                        <span className="equipment-name">{request.equipment.name}</span>
                        <span className="equipment-serial">Serial: {request.equipment.serial_number}</span>
                      </>
                    ) : request.category === 'work_center' && request.workCenter ? (
                      <>
                        <span className="equipment-name">{request.workCenter.name}</span>
                        <span className="equipment-serial">
                          {request.workCenter.code ? `Code: ${request.workCenter.code}` : 'Work Center'}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted">Not specified</span>
                    )}
                  </div>
                </td>
                <td>
                  {request.assignedTechnician ? (
                    <div className="cell-content">
                      <span className="technician-name">{request.assignedTechnician.name}</span>
                      <span className="technician-email">{request.assignedTechnician.email}</span>
                    </div>
                  ) : (
                    <span className="text-muted">Unassigned</span>
                  )}
                </td>
                <td>
                  <span className={`type-badge type-badge-${request.type}`}>
                    {request.type === 'corrective' ? 'Corrective' : 'Preventive'}
                  </span>
                </td>
                <td>
                  <span className={`state-badge ${getStateBadgeClass(request.state)}`}>
                    {getStateLabel(request.state)}
                  </span>
                </td>
                <td className="text-muted">{formatDate(request.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


