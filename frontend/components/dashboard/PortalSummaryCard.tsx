interface PortalSummaryCardProps {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
}

export default function PortalSummaryCard({ total, new: newCount, inProgress, completed }: PortalSummaryCardProps) {
  return (
    <div className="portal-summary-card">
      <div className="portal-summary-header">
        <h3 className="portal-summary-title">My Requests</h3>
        <div className="portal-summary-total">
          <span className="portal-summary-total-value">{total}</span>
          <span className="portal-summary-total-label">Total</span>
        </div>
      </div>
      
      <div className="portal-summary-stats">
        <div className="portal-summary-stat">
          <div className="portal-summary-stat-value portal-stat-new">{newCount}</div>
          <div className="portal-summary-stat-label">New</div>
        </div>
        
        <div className="portal-summary-stat">
          <div className="portal-summary-stat-value portal-stat-progress">{inProgress}</div>
          <div className="portal-summary-stat-label">In Progress</div>
        </div>
        
        <div className="portal-summary-stat">
          <div className="portal-summary-stat-value portal-stat-completed">{completed}</div>
          <div className="portal-summary-stat-label">Completed</div>
        </div>
      </div>

      <div className="portal-summary-footer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <span>Track your maintenance requests in real-time</span>
      </div>
    </div>
  );
}


