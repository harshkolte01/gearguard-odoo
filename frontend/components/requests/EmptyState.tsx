'use client';

import Button from '../ui/Button';

interface EmptyStateProps {
  variant: 'no-requests' | 'no-results' | 'permission-denied';
  onAction?: () => void;
}

export default function EmptyState({ variant, onAction }: EmptyStateProps) {
  const content = {
    'no-requests': {
      title: 'No Maintenance Requests Yet',
      message: 'Create your first maintenance request to get started.',
      actionText: 'Create First Request',
      icon: '📋',
    },
    'no-results': {
      title: 'No Results Found',
      message: 'Try adjusting your filters or search terms.',
      actionText: 'Clear Filters',
      icon: '🔍',
    },
    'permission-denied': {
      title: 'Access Restricted',
      message: 'You don\'t have permission to view this content.',
      actionText: null,
      icon: '🔒',
    },
  };

  const { title, message, actionText, icon } = content[variant];

  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

