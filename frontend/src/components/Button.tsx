import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full-width' : ''} ${
          loading ? 'btn--loading' : ''
        }`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <span className="btn__spinner"></span> : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
