import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => (
  <div className={`spinner spinner--${size}`} aria-label="Loading" />
);

Spinner.displayName = 'Spinner';
