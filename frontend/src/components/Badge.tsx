import React from 'react';
import './Badge.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => (
  <span
    className={`badge badge--${variant} badge--${size} ${className}`}
    {...props}
  />
);

Badge.displayName = 'Badge';
