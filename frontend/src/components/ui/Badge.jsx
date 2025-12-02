import React from 'react';
import { cn } from './Card';

export const Badge = ({ children, className, variant = 'default' }) => {
    const variants = {
        default: "bg-slate-100 text-slate-800",
        success: "bg-emerald-100 text-emerald-800",
        warning: "bg-amber-100 text-amber-800",
        danger: "bg-rose-100 text-rose-800",
        indigo: "bg-indigo-100 text-indigo-800"
    };

    return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
            {children}
        </span>
    );
};
