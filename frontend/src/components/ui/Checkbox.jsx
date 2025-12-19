import React from 'react';
import { Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Checkbox = ({ id, label, checked, onChange, className = '', ...props }) => {
  return (
    <div className={twMerge("flex items-center cursor-pointer group", className)} onClick={() => onChange({ target: { checked: !checked } })}>
      <div className="relative flex items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only" // Hide the native checkbox
          {...props}
        />
        <div
          className={twMerge(
            "h-6 w-6 rounded-md border-2 transition-all duration-200 ease-in-out flex items-center justify-center",
            "border-brand-border bg-brand-card group-hover:border-brand-primary/50", // Default state
            "peer-checked:bg-brand-primary peer-checked:border-brand-primary", // Checked state
            "peer-focus:ring-2 peer-focus:ring-brand-primary/50 peer-focus:ring-offset-1 peer-focus:ring-offset-brand-dark" // Focus state
          )}
        >
          <Check 
            className={twMerge(
              "w-3.5 h-3.5 text-brand-dark transition-transform duration-200 scale-0",
              checked && "scale-100"
            )} 
            strokeWidth={3}
          />
        </div>
      </div>
      {label && (
        <label 
          htmlFor={id} 
          className="ml-3 text-sm font-medium text-gray-300 cursor-pointer select-none group-hover:text-white transition-colors"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
