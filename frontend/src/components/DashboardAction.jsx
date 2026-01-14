import React from 'react';
import { ArrowUp, ArrowDown, ArrowRightLeft } from 'lucide-react';

const variants = {
  success: {
    borderColor: 'border-brand-success',
    shadow: 'hover:shadow-brand-success/20',
    titleColor: 'text-white',
    iconColor: 'text-brand-success',
    Icon: ArrowUp
  },
  primary: {
    borderColor: 'border-brand-primary',
    shadow: 'hover:shadow-brand-primary/20',
    titleColor: 'text-white',
    iconColor: 'text-brand-primary',
    Icon: ArrowRightLeft
  },
  danger: {
    borderColor: 'border-brand-danger',
    shadow: 'hover:shadow-brand-danger/20',
    titleColor: 'text-white',
    iconColor: 'text-brand-danger',
    Icon: ArrowDown
  },
  info: { // Keep info just in case, though not used in print. fallback to primary style or define one?
    borderColor: 'border-brand-info',
    shadow: 'hover:shadow-brand-info/20',
    titleColor: 'text-white',
    iconColor: 'text-brand-info',
    Icon: ArrowRightLeft
  }
};

function DashboardAction({ variant = 'primary', label, onClick, className = '' }) {
  const style = variants[variant] || variants.primary;
  const Icon = style.Icon;

  return (
    <button 
      onClick={onClick}
      className={`w-full bg-brand-card hover:bg-brand-card-hover border ${style.borderColor} rounded-2xl p-4 flex items-center justify-between transition-all duration-300 group shadow-lg ${style.shadow} hover:-translate-y-1 min-h-16 cursor-pointer ${className}`}
    >
      <span className={`text-lg font-bold uppercase tracking-wider ${style.titleColor}`}>{label}</span>
      <div className={`p-2 rounded-full border ${style.borderColor} ${style.iconColor} group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
    </button>
  );
}

export default DashboardAction;
