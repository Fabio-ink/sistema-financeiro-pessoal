import React from 'react';

function Button({ variant = 'primary', size = 'md', children, className = '', ...props }) {
  const baseStyle = "font-semibold transition-colors disabled:opacity-50 rounded-lg cursor-pointer flex items-center justify-center gap-2";

  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };

  const variantStyles = {
    primary: 'bg-brand-primary hover:bg-brand-primary-hover text-white',
    secondary: 'bg-brand-secondary hover:bg-brand-secondary-hover text-gray-300',
    outline: 'bg-transparent border-2 border-brand-border hover:bg-brand-secondary text-gray-300',
    ghost: 'bg-transparent hover:bg-brand-secondary text-gray-300',
    danger: 'bg-brand-red hover:opacity-80 text-white',
    success: 'bg-brand-green hover:opacity-80 text-black',
    info: 'bg-brand-purple hover:opacity-80 text-black',
  };

  const buttonClassName = `${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
}

export default Button;