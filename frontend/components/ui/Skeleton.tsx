'use client';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  style?: React.CSSProperties;
}

function Skeleton({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
  style = {},
}: SkeletonProps) {
  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={{ width, height, ...style }}
    />
  );
}

// KPI Cards Skeleton
export function SkeletonKPICards({ count = 3 }: { count?: number }) {
  return (
    <div className="kpi-grid" style={{ marginBottom: '2.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="kpi-card" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="kpi-header" style={{ marginBottom: '1.25rem' }}>
            <Skeleton height="0.875rem" width="60%" />
            <Skeleton height="0.75rem" width="4rem" />
          </div>
          <div className="kpi-content">
            <div style={{ marginBottom: '1rem' }}>
              <Skeleton height="2.5rem" width="5rem" className="skeleton-mb" style={{ marginBottom: '0.5rem' }} />
              <Skeleton height="0.875rem" width="7rem" />
            </div>
            <Skeleton height="0.875rem" width="90%" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Filter Bar Skeleton
export function SkeletonFilterBar() {
  return (
    <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Skeleton height="1.125rem" width="12rem" className="skeleton-mb" style={{ marginBottom: '0.5rem' }} />
        <Skeleton height="0.875rem" width="20rem" />
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <Skeleton height="2.5rem" />
        </div>
        <Skeleton height="2.5rem" width="120px" />
        <Skeleton height="2.5rem" width="120px" />
        <Skeleton height="2.5rem" width="100px" />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <Skeleton height="2rem" width="80px" />
        <Skeleton height="2rem" width="110px" />
        <Skeleton height="2rem" width="90px" />
        <Skeleton height="2rem" width="80px" />
      </div>
    </div>
  );
}

// Requests Table Skeleton
export function SkeletonRequestsTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="requests-table-container">
      <div className="requests-table-wrapper">
        <table className="requests-table">
          <thead>
            <tr>
              <th><Skeleton height="0.8rem" width="60px" /></th>
              <th><Skeleton height="0.8rem" width="80px" /></th>
              <th><Skeleton height="0.8rem" width="90px" /></th>
              <th><Skeleton height="0.8rem" width="70px" /></th>
              <th><Skeleton height="0.8rem" width="50px" /></th>
              <th><Skeleton height="0.8rem" width="70px" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                <td>
                  <div className="cell-content">
                    <Skeleton height="1rem" width="85%" className="skeleton-mb" style={{ marginBottom: '0.35rem' }} />
                    <Skeleton height="0.8rem" width="65%" />
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    <Skeleton height="1rem" width="75%" className="skeleton-mb" style={{ marginBottom: '0.35rem' }} />
                    <Skeleton height="0.8rem" width="55%" />
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    <Skeleton height="1rem" width="70%" className="skeleton-mb" style={{ marginBottom: '0.35rem' }} />
                    <Skeleton height="0.8rem" width="60%" />
                  </div>
                </td>
                <td>
                  <Skeleton height="1.5rem" width="90px" />
                </td>
                <td>
                  <Skeleton height="1.5rem" width="85px" />
                </td>
                <td>
                  <Skeleton height="0.875rem" width="80px" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Kanban Board Skeleton
export function SkeletonKanbanBoard() {
  return (
    <div className="kanban-board">
      {['New', 'In Progress', 'Repaired', 'Scrap'].map((stage, columnIndex) => (
        <div key={stage} className="kanban-column" style={{ animationDelay: `${columnIndex * 0.1}s` }}>
          <div className="kanban-column-header">
            <Skeleton height="0.875rem" width="80px" />
            <Skeleton height="24px" width="24px" variant="circular" />
          </div>
          <div className="kanban-column-content">
            <div className="kanban-cards-list">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <div 
                  key={cardIndex} 
                  className="kanban-card"
                  style={{ animationDelay: `${(columnIndex * 0.1) + (cardIndex * 0.05)}s` }}
                >
                  <div className="kanban-card-header" style={{ marginBottom: '0.5rem' }}>
                    <Skeleton height="0.9375rem" width="85%" />
                    <Skeleton height="24px" width="24px" variant="circular" />
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <Skeleton height="0.8125rem" width="95%" className="skeleton-mb" style={{ marginBottom: '0.25rem' }} />
                    <Skeleton height="0.8125rem" width="75%" />
                  </div>
                  <div style={{ 
                    padding: '0.625rem', 
                    background: 'var(--bg-primary)', 
                    borderRadius: '0.375rem',
                    marginBottom: '0.75rem'
                  }}>
                    <Skeleton height="0.8125rem" width="70%" className="skeleton-mb" style={{ marginBottom: '0.25rem' }} />
                    <Skeleton height="0.75rem" width="50%" />
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Skeleton height="28px" width="28px" variant="circular" />
                      <Skeleton height="0.75rem" width="80px" />
                    </div>
                    <Skeleton height="1.25rem" width="60px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Full Page Dashboard Skeleton
export function SkeletonDashboard({ includeKPIs = true }: { includeKPIs?: boolean }) {
  return (
    <div className="dashboard-main">
      {/* Welcome Section */}
      <div className="dashboard-welcome" style={{ marginBottom: '2.5rem' }}>
        <Skeleton height="2.5rem" width="18rem" className="skeleton-mb" style={{ marginBottom: '0.75rem' }} />
        <Skeleton height="1.125rem" width="28rem" />
      </div>

      {/* KPI Cards */}
      {includeKPIs && <SkeletonKPICards count={3} />}

      {/* Filter Bar */}
      <SkeletonFilterBar />

      {/* Requests Table */}
      <SkeletonRequestsTable rows={5} />
    </div>
  );
}

export default Skeleton;
