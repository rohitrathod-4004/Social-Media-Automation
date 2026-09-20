import React from 'react';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

interface StatusBadgeProps {
  status: PostStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let badgeClasses = "px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ";
  
  switch (status.toLowerCase()) {
    case 'draft':
      badgeClasses += "bg-warning-bg text-warning-text border-warning-border";
      break;
    case 'scheduled':
      badgeClasses += "bg-info-bg text-info-text border-info-border";
      break;
    case 'published':
      badgeClasses += "bg-success-bg text-success-text border-success-border";
      break;
    case 'failed':
      badgeClasses += "bg-error-bg text-error-text border-error-border";
      break;
    default:
      badgeClasses += "bg-surface-secondary text-text-muted border-border-subtle";
  }

  return (
    <span className={`${badgeClasses} ${className}`}>
      {status}
    </span>
  );
};
