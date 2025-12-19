import React from 'react';
import { twMerge } from 'tailwind-merge';

const IconButton = ({ 
    children, 
    onClick, 
    className = '', 
    variant = 'ghost', 
    color = 'default',
    title,
    size = 'md',
    disabled = false,
    type = 'button'
}) => {
    
    const baseStyles = "flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    
    const sizeStyles = {
        sm: "p-1.5",
        md: "p-2",
        lg: "p-3"
    };

    const variants = {
        ghost: "bg-transparent border border-transparent hover:bg-white/5",
        outline: "bg-transparent border border-gray-700 hover:border-gray-500",
        filled: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20",
    };

    // Color variations for ghost/outline variants (affects text and hover bg)
    const colorStyles = {
        default: "text-gray-400 hover:text-white",
        primary: "text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10",
        danger: "text-gray-400 hover:text-red-400 hover:bg-red-500/10",
        success: "text-gray-400 hover:text-green-400 hover:bg-green-500/10",
        white: "text-white hover:bg-white/10"
    };

    // If variant is filled, color prop might just be ignored or handled differently, 
    // but for now let's assume 'filled' implies primary brand color. 
    // If we wanted filled-danger, we'd need more logic.
    // For this refactor, we mostly need ghost+default (DatePicker) and ghost+primary/danger (TransactionList).

    const combinedStyles = twMerge(
        baseStyles,
        sizeStyles[size],
        variants[variant],
        variant !== 'filled' && colorStyles[color], // Apply text colors only if not filled
        className
    );

    return (
        <button
            type={type}
            onClick={onClick}
            className={combinedStyles}
            title={title}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default IconButton;
