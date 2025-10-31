import React from 'react';

function Button({ variant = 'primary', size = 'md', children, className = '', ...props }) {
  const baseStyle = "font-semibold transition-colors disabled:opacity-50 rounded-lg";

  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white',
    ghost: 'bg-gray-600 hover:bg-gray-500 text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
  };

  const buttonClassName = `${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
}

export default Button;