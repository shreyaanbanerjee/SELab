import React, { useEffect, useState } from 'react';
import api from '../api';
import { Users, Briefcase, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="border-l-4" style={{ borderLeftColor: color }}>
        <CardContent className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: `${color}20` }}>
                <Icon className="w-6 h-6" style={{ color: color }} />
            </div>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ people: 0, projects: 0, allocations: 0 });
    const [allocationData, setAllocationData] = useState([]);
    const [projectStatusData, setProjectStatusData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [peopleRes, projectsRes] = await Promise.all([
                    api.get('/people/'),
                    api.get('/projects/')
                ]);

                const people = peopleRes.data;
                const projects = projectsRes.data;

                // 1. Calculate Resource Utilization
                const totalCapacity = people.length * 100;
                const currentAvailability = people.reduce((sum, p) => sum + p.availability, 0);
                const allocatedCapacity = totalCapacity - currentAvailability;

                // Avoid division by zero
                const allocatedPercentage = totalCapacity > 0 ? Math.round((allocatedCapacity / totalCapacity) * 100) : 0;
                const unallocatedPercentage = totalCapacity > 0 ? Math.round((currentAvailability / totalCapacity) * 100) : 0;

                setAllocationData([
                    { name: 'Allocated', value: allocatedPercentage, color: '#4f46e5' },
                    { name: 'Available', value: unallocatedPercentage, color: '#e2e8f0' },
                ]);

                // 2. Calculate Project Status
                const statusCounts = projects.reduce((acc, project) => {
                    const status = project.status || 'Active'; // Default to Active if undefined
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                }, {});

                const statusData = Object.keys(statusCounts).map(status => ({
                    name: status,
                    count: statusCounts[status]
                }));
                setProjectStatusData(statusData);

                // 3. Set Stats
                setStats({
                    people: people.length,
                    projects: projects.length,
                    allocations: people.filter(p => p.availability < 100).length // Count people with some allocation
                });

            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <span className="text-sm text-slate-500">Last updated: Just now</span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Personnel" value={stats.people} icon={Users} color="#4f46e5" />
                <StatCard title="Active Projects" value={stats.projects} icon={Briefcase} color="#0ea5e9" />
                <StatCard title="Active Allocations" value={stats.allocations} icon={Activity} color="#10b981" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Resource Utilization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={allocationData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {allocationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-4 text-sm text-slate-500">
                            <span className="inline-flex items-center mr-4"><span className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></span>Allocated</span>
                            <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-slate-200 mr-2"></span>Available</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Project Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={projectStatusData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
