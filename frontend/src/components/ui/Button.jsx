import React from 'react';
import { cn } from './Card';

export const Button = ({ children, className, variant = 'primary', ...props }) => {
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
        secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-indigo-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
