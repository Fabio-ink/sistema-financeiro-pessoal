import React from 'react';

function Input({ className = '', ...props }) {
  const inputClasses = `w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`;
  
  return (
    <input className={inputClasses} {...props} />
  );
}

export default Input;
