'use client';

import { useParams, useRouter } from 'next/navigation';
import { useRequestDetail } from '@/lib/hooks/useRequestDetail';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import RequestStateActions from '@/components/requests/RequestStateActions';
import AssignTechnicianSection from '@/components/requests/AssignTechnicianSection';
import { userStorage } from '@/lib/auth';

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { request, loading, error, refetch } = useRequestDetail(id);
  const user = userStorage.get();
  const userRole = user?.role;

  // Loading state with shimmer effect
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-main">
          <div className="request-detail-header">
            <Button variant="ghost" onClick={() => router.push('/')}>
              ← Back to Dashboard
            </Button>
          </div>
          
          <div className="request-detail-loading">
            <div style={{ marginBottom: '2rem' }}>
              <Skeleton height="3rem" className="skeleton-mb" />
              <Skeleton height="1.5rem" width="70%" className="skeleton-mb" />
              <Skeleton height="1rem" width="50%" />
            </div>
            <div className="request-detail-grid">
              <div className="request-detail-section">
                <Skeleton height="22rem" className="skeleton-mb" />
                <Skeleton height="18rem" />
              </div>
              <div className="request-detail-section">
                <Skeleton height="16rem" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with proper messaging based on role
  if (error || !request) {
    const getErrorMessage = () => {
      if (error?.includes('403') || error?.includes('Access denied') || error?.includes('permission')) {
        if (userRole === 'portal') {
          return "You can only view your own maintenance requests.";
        } else if (userRole === 'technician') {
          return "You can only view maintenance requests assigned to your team.";
        }
        return "You don't have permission to view this request.";
      }
      return error || 'The maintenance request you are looking for does not exist.';
    };

    return (
      <div className="dashboard-container">
        <div className="dashboard-main">
          <div className="request-detail-header">
            <Button variant="ghost" onClick={() => router.push('/')}>
              ← Back to Dashboard
            </Button>
          </div>
          
          <div className="request-error-container">
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h2 className="empty-state-title">Request Not Found</h2>
              <p className="empty-state-message">{getErrorMessage()}</p>
              <Button onClick={() => router.push('/')}>
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Check if user can perform actions on this request
  const canUpdateRequest = () => {
    if (!user) return false;
    
    // Portal users cannot update any requests
    if (userRole === 'portal') return false;
    
    // Admin and Manager can update all requests
    if (userRole === 'admin' || userRole === 'manager') return true;
    
    // Technicians can update requests from their team
    // (Backend will validate this)
    if (userRole === 'technician') return true;
    
    return false;
  };

  const isRequestOwner = request.creator.id === user?.id;

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        {/* Enhanced Header with breadcrumb style */}
        <div className="request-detail-header">
          <Button variant="ghost" onClick={() => router.push('/')} className="back-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </Button>
          
          {/* Role indicator badge */}
          {userRole && (
            <div className="request-detail-role-badge">
              <span className="role-badge-label">Viewing as:</span>
              <Badge variant={userRole === 'admin' ? 'repaired' : userRole === 'portal' ? 'new' : 'in_progress'}>
                {userRole.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>

        <div className="request-detail-container">
          {/* Enhanced Title Section with better visual hierarchy */}
          <div className="request-detail-title-section">
            <div className="request-detail-title-row">
              <div className="request-title-group">
                <h1 className="request-detail-title">{request.subject}</h1>
                <div className="request-detail-subtitle">
                  <span className="request-id-badge">#{request.id.slice(0, 8)}</span>
                  <span className="request-detail-meta-separator">•</span>
                  <span className="request-type-badge">{request.type}</span>
                  <span className="request-detail-meta-separator">•</span>
                  <span className="request-category-badge">
                    {request.category === 'work_center' ? 'Work Center' : 'Equipment'}
                  </span>
                </div>
              </div>
              <Badge variant={request.state}>
                {request.state.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            
            <div className="request-detail-meta">
              <div className="meta-item-group">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Created {formatDate(request.created_at)}</span>
              </div>
              
              {request.scheduled_date && (
                <>
                  <span className="request-detail-meta-separator">•</span>
                  <div className="meta-item-group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Scheduled for {formatDate(request.scheduled_date)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Owner indicator for portal users */}
            {userRole === 'portal' && isRequestOwner && (
              <div className="request-owner-indicator">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Your Request</span>
              </div>
            )}
          </div>

          <div className="request-detail-grid">
            {/* Left Column - Information */}
            <div className="request-detail-section">
              {/* Description Card */}
              <div className="request-detail-card-wrapper">
                <div className="request-detail-card">
                  <h3 className="request-detail-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    Description
                  </h3>
                  <p className="request-detail-description">
                    {request.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Equipment/Work Center & Assignment Info Card */}
              <div className="request-detail-card-wrapper">
                <div className="request-detail-card">
                  <h3 className="request-detail-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    {request.category === 'work_center' ? 'Work Center Details' : 'Equipment Details'}
                  </h3>
                  <div className="request-detail-info-grid">
                    {/* Equipment or Work Center Information */}
                    {request.category === 'equipment' && request.equipment ? (
                      <div className="request-detail-info-item">
                        <span className="request-detail-info-label">Equipment</span>
                        <span className="request-detail-info-value">
                          <span className="request-detail-user-name">{request.equipment.name}</span>
                          <span className="request-detail-user-email">Serial: {request.equipment.serial_number}</span>
                          {request.equipment.department && (
                            <span className="request-detail-user-email">Dept: {request.equipment.department}</span>
                          )}
                        </span>
                      </div>
                    ) : request.category === 'work_center' && request.workCenter ? (
                      <div className="request-detail-info-item">
                        <span className="request-detail-info-label">Work Center</span>
                        <span className="request-detail-info-value">
                          <span className="request-detail-user-name">{request.workCenter.name}</span>
                          {request.workCenter.code && (
                            <span className="request-detail-user-email">Code: {request.workCenter.code}</span>
                          )}
                        </span>
                      </div>
                    ) : null}
                    
                    {/* Show assignment info only for non-portal users or if they're the creator */}
                    {(userRole !== 'portal' || isRequestOwner) && (
                      <>
                        <div className="request-detail-info-item">
                          <span className="request-detail-info-label">Maintenance Team</span>
                          <span className="request-detail-info-value">
                            {request.team ? (
                              <span className="request-detail-user-name">{request.team.name}</span>
                            ) : (
                              <span className="request-detail-unassigned">Not assigned yet</span>
                            )}
                          </span>
                        </div>
                        
                        <div className="request-detail-info-item">
                          <span className="request-detail-info-label">Assigned Technician</span>
                          <span className="request-detail-info-value">
                            {request.assignedTechnician ? (
                              <>
                                <span className="request-detail-user-name">{request.assignedTechnician.name}</span>
                                <span className="request-detail-user-email">{request.assignedTechnician.email}</span>
                              </>
                            ) : (
                              <span className="request-detail-unassigned">Will be assigned by team</span>
                            )}
                          </span>
                        </div>
                      </>
                    )}
                    
                    <div className="request-detail-info-item">
                      <span className="request-detail-info-label">Requested By</span>
                      <span className="request-detail-info-value">
                        <span className="request-detail-user-name">
                          {request.creator.name}
                          {isRequestOwner && ' (You)'}
                        </span>
                        <span className="request-detail-user-email">{request.creator.email}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="request-detail-card-wrapper">
                <div className="request-detail-card">
                  <h3 className="request-detail-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Timeline
                  </h3>
                  <div className="request-detail-timeline">
                    <div className="timeline-item">
                      <div className={`timeline-marker ${request.created_at ? 'timeline-marker-complete' : ''}`} />
                      <div className="timeline-content">
                        <span className="timeline-label">Request Created</span>
                        <span className="timeline-value">{formatDateTime(request.created_at)}</span>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className={`timeline-marker ${request.scheduled_date ? 'timeline-marker-complete' : ''}`} />
                      <div className="timeline-content">
                        <span className="timeline-label">Scheduled Date</span>
                        <span className="timeline-value">{formatDateTime(request.scheduled_date)}</span>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className={`timeline-marker ${request.duration_hours ? 'timeline-marker-complete' : ''}`} />
                      <div className="timeline-content">
                        <span className="timeline-label">Estimated Duration</span>
                        <span className="timeline-value">
                          {request.duration_hours ? `${request.duration_hours} hours` : 'Not estimated yet'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Actions/Status based on role */}
            <div className="request-detail-section">
              <div className="request-actions-section">
                <div className="request-actions-card">
                  <h3 className="request-detail-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    {canUpdateRequest() ? 'Actions & Status' : 'Current Status'}
                  </h3>
                  
                  {/* Role-specific action panel */}
                  <RequestStateActions
                    requestId={request.id}
                    currentState={request.state}
                    category={request.category}
                    onSuccess={refetch}
                    canUpdate={canUpdateRequest()}
                    hasAssignedTechnician={!!request.assignedTechnician}
                  />
                  
                  {/* Permission notice for portal users */}
                  {userRole === 'portal' && (
                    <div className="permission-notice">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <span>Your maintenance team will update the status as work progresses.</span>
                    </div>
                  )}
                </div>

                {/* Technician Assignment Section (Admin/Manager only) */}
                <AssignTechnicianSection
                  request={request}
                  userRole={userRole as 'admin' | 'manager' | 'technician' | 'portal'}
                  onSuccess={refetch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
