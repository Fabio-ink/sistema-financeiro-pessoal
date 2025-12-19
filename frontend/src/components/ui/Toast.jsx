import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
};

const bgColors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900'
};

const Toast = ({ type = 'info', title, message, onClose }) => {
    return (
        <div className={`flex items-start p-4 rounded-lg border shadow-lg max-w-sm w-full animate-in slide-in-from-right-full ${bgColors[type]}`}>
            <div className="flex-shrink-0 mr-3">
                {icons[type]}
            </div>
            <div className="flex-1 mr-2">
                {title && <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h4>}
                {message && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{message}</p>}
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
