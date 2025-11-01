import React from 'react';

const Checkbox = ({ id, label, checked, onChange, className = '', ...props }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out rounded border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
