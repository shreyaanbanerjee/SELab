import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Card = ({ children, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn("bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300", className)}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const CardHeader = ({ children, className }) => (
    <div className={cn("px-6 py-4 border-b border-slate-100", className)}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
    <h3 className={cn("text-lg font-semibold text-slate-800", className)}>{children}</h3>
);

export const CardContent = ({ children, className }) => (
    <div className={cn("p-6", className)}>{children}</div>
);
