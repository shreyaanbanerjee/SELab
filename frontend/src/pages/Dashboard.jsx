import React, { useEffect, useState } from 'react';
import api from '../api';
import { Users, Briefcase, CheckCircle } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ people: 0, projects: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [peopleRes, projectsRes] = await Promise.all([
                    api.get('/people/'),
                    api.get('/projects/')
                ]);
                setStats({
                    people: peopleRes.data.length,
                    projects: projectsRes.data.length
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Personnel</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">{stats.people}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Briefcase className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">{stats.projects}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
