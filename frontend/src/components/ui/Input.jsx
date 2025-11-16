import React, { useId } from 'react';

function Input({ label, className = '', type = 'text', ...props }) {
  const id = useId();

  const wrapperClasses = `relative ${className}`;
  const inputClasses = `w-full p-2 bg-transparent border-b-2 border-brand-border text-white placeholder-gray-500
                        focus:outline-none focus:border-brand-primary transition-colors`;

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">
          {label}
        </label>
      )}
      <input id={id} type={type} className={inputClasses} {...props} />
    </div>
  );
}

export default Input;