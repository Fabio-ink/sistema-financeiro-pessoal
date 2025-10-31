import React from 'react';

function Card({ as: Component = 'div', children, className = '', ...props }) {
  const cardClasses = `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6 ${className}`;

  return (
    <Component className={cardClasses} {...props}>
      {children}
    </Component>
  );
}

export default Card;
