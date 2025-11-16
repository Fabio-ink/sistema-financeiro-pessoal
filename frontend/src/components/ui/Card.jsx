import React from 'react';

function Card({ as: Component = 'div', children, className = '', ...props }) {
  const cardClasses = `bg-brand-card border border-brand-border rounded-xl shadow-lg ${className}`;

  return (
    <Component className={cardClasses} {...props}>
      {children}
    </Component>
  );
}

export default Card;