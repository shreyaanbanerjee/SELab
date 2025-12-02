import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Briefcase, LayoutDashboard, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/projects', label: 'Projects', icon: Briefcase },
        { path: '/people', label: 'People', icon: Users },
        { path: '/allocator', label: 'Smart Allocator', icon: BrainCircuit },
    ];

    return (
        <nav className="glass-panel sticky top-0 z-50 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                            <div className="bg-indigo-600 p-1.5 rounded-lg">
                                <BrainCircuit className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                SmartAlloc
                            </span>
                        </Link>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${active ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                            }`}
                                    >
                                        {active && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute inset-0 bg-indigo-50 rounded-md -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            AD
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
