import React, { useState, useEffect } from 'react';
import api from '../api';
import { BrainCircuit, CheckCircle, AlertCircle } from 'lucide-react';

const Allocator = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allocationEffort, setAllocationEffort] = useState(50);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects/');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchSuggestions = async (projectId) => {
        setLoading(true);
        try {
            const response = await api.get(`/allocations/suggestions/${projectId}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectChange = (e) => {
        const projectId = e.target.value;
        const project = projects.find(p => p.id === parseInt(projectId));
        setSelectedProject(project);
        if (projectId) {
            fetchSuggestions(projectId);
        } else {
            setSuggestions([]);
        }
    };

    const handleAllocate = async (personId) => {
        if (!selectedProject) return;
        try {
            await api.post('/allocations/', {
                person_id: personId,
                project_id: selectedProject.id,
                effort_percentage: allocationEffort
            });
            alert('Allocation successful!');
            fetchSuggestions(selectedProject.id); // Refresh to see updated availability
        } catch (error) {
            alert('Allocation failed: ' + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Smart Allocation</h3>
                        <p className="mt-1 text-sm text-gray-500">Select a project to get AI-powered personnel suggestions.</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Select Project</label>
                        <select
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            onChange={handleProjectChange}
                            value={selectedProject?.id || ''}
                        >
                            <option value="">-- Select a Project --</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {selectedProject && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Suggestions for {selectedProject.name}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Ranked by skill match, availability, and role fit.
                        </p>
                    </div>
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Thinking...</div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {suggestions.map(({ person, score, match_reason }) => (
                                <li key={person.id} className="hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${score > 50 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                                    <span className={`font-bold ${score > 50 ? 'text-green-800' : 'text-yellow-800'}`}>{score}</span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-indigo-600">{person.name}</div>
                                                    <div className="text-sm text-gray-500">{person.role} • {match_reason}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-sm text-gray-500">
                                                    Avail: <span className={person.availability < 50 ? 'text-red-500' : 'text-green-500'}>{person.availability}%</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        min="10"
                                                        max="100"
                                                        step="10"
                                                        className="w-16 text-sm border-gray-300 rounded-md"
                                                        value={allocationEffort}
                                                        onChange={(e) => setAllocationEffort(parseInt(e.target.value))}
                                                    />
                                                    <button
                                                        onClick={() => handleAllocate(person.id)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        Allocate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default Allocator;
