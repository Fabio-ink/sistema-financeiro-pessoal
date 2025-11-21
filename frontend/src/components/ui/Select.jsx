import React, { useId } from 'react';

function Select({ label, id, className = '', children, ...props }) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const wrapperClasses = `relative ${className}`;
  const selectClasses = `w-full p-3 bg-brand-dark border border-brand-border rounded-xl text-white 
                         focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all appearance-none`;
  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-text-secondary mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select id={selectId} className={selectClasses} {...props}>
            {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
}
export default Select;
