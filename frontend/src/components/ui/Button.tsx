import React, { type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    
    // Base classes
    const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    // Variant classes
    const variantClasses = {
      primary: "bg-primary text-white hover:bg-primary-hover",
      secondary: "bg-surface text-text-secondary border border-border hover:bg-surface-secondary",
      ghost: "bg-transparent text-text-muted hover:bg-surface-secondary hover:text-text-primary",
      destructive: "bg-error-bg text-error-text border border-error-border hover:bg-red-100 focus-visible:ring-red-500",
    };



    // Size classes
    const sizeClasses = {
      sm: "h-9 px-3 text-xs rounded-md",
      md: "h-10 px-4 py-2 text-sm rounded-md",
      lg: "h-12 px-6 py-3 text-base rounded-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

    return (
      <button ref={ref} className={combinedClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
