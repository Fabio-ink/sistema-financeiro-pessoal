import React from 'react';

function Select({ className = '', children, ...props }) {
  const selectClasses = `w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`;

  return (
    <select className={selectClasses} {...props}>
      {children}
    </select>
  );
}

export default Select;
