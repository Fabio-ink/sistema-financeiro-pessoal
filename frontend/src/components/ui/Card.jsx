import React from 'react';

function Card({ children, className = '', as = 'div', ...props }) {
  const Component = as;
  const cardClasses = `bg-brand-card border border-brand-border rounded-xl shadow-lg ${className}`;

  return (
    <Component className={cardClasses} {...props}>
      {children}
    </Component>
  );
}

export default Card;