import React, { useId } from 'react';

function Input({ label, id, className = '', type = 'text', ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const wrapperClasses = `relative ${className}`;
  const inputClasses = `w-full p-3 bg-brand-dark border border-brand-border rounded-xl text-white placeholder-text-muted
                        focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all`;
  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary mb-2 ml-1">
          {label}
        </label>
      )}
      <input id={inputId} type={type} className={inputClasses} {...props} />
    </div>
  );
}
export default Input;