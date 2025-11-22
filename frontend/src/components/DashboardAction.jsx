import React from 'react';
import { ArrowUp, ArrowDown, ArrowRightLeft } from 'lucide-react';

const variants = {
  success: {
    gradient: 'from-brand-success to-brand-success-hover hover:from-brand-success-hover hover:to-[#009e74]',
    shadow: 'hover:shadow-brand-success/20',
    text: 'text-brand-dark',
    iconBg: 'bg-black/10',
    Icon: ArrowUp
  },
  primary: {
    gradient: 'from-brand-primary to-brand-primary-hover hover:from-brand-primary-hover hover:to-[#6b4cdb]',
    shadow: 'hover:shadow-brand-primary/20',
    text: 'text-white',
    iconBg: 'bg-black/20',
    Icon: ArrowRightLeft
  },
  danger: {
    gradient: 'from-brand-danger to-brand-danger-hover hover:from-brand-danger-hover hover:to-[#cc2929]',
    shadow: 'hover:shadow-brand-danger/20',
    text: 'text-white',
    iconBg: 'bg-black/20',
    Icon: ArrowDown
  }
};

function DashboardAction({ variant = 'primary', label, onClick, className = '' }) {
  const style = variants[variant] || variants.primary;
  const Icon = style.Icon;

  return (
    <button 
      onClick={onClick}
      className={`w-full bg-linear-to-br ${style.gradient} ${style.text} rounded-2xl p-4 flex items-center justify-between transition-all duration-300 group shadow-lg ${style.shadow} hover:-translate-y-1 min-h-16 cursor-pointer ${className}`}
    >
      <span className="text-lg font-bold uppercase tracking-wider">{label}</span>
      <div className={`${style.iconBg} p-3 rounded-full group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
    </button>
  );
}

export default DashboardAction;
