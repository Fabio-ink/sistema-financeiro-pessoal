import React from 'react';

function Button({ variant = 'primary', size = 'md', children, className = '', ...props }) {
  const baseStyle = "font-semibold transition-all disabled:opacity-50 rounded-xl cursor-pointer flex items-center justify-center gap-2 active:scale-95";

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-5',
    lg: 'py-3.5 px-7 text-lg',
  };

  const variantStyles = {
    primary: 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-lg shadow-brand-primary/20',
    secondary: 'bg-brand-secondary hover:bg-brand-secondary-hover text-white',
    outline: 'bg-transparent border border-brand-border hover:bg-brand-secondary/50 text-text-secondary hover:text-white',
    ghost: 'bg-transparent hover:bg-brand-secondary/50 text-text-secondary hover:text-white',
    danger: 'bg-brand-danger hover:bg-brand-danger-hover text-white shadow-lg shadow-brand-danger/20',
    success: 'bg-brand-success hover:bg-brand-success-hover text-brand-dark font-bold shadow-lg shadow-brand-success/20',
    info: 'bg-brand-info hover:opacity-90 text-brand-dark font-bold shadow-lg shadow-brand-info/20',
  };

  const buttonClassName = `${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
}

export default Button;