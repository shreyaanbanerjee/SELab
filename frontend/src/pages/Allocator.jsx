import React, { useState, useEffect } from 'react';
import api from '../api';
import { BrainCircuit, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

import { toast } from 'sonner';

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
            toast.success('Allocation successful!', {
                description: `Allocated ${personId} to ${selectedProject.name}`
            });
            fetchSuggestions(selectedProject.id);
        } catch (error) {
            toast.error('Allocation failed', {
                description: error.response?.data?.detail || error.message
            });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
                        <Sparkles className="w-8 h-8 text-indigo-500 mr-3" />
                        Smart Allocator
                    </h1>
                    <p className="text-slate-500 mt-1">AI-powered personnel matching engine.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24 border-indigo-100 shadow-indigo-50">
                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-white">
                            <CardTitle className="text-indigo-900">Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Project</label>
                                <select
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    onChange={handleProjectChange}
                                    value={selectedProject?.id || ''}
                                >
                                    <option value="">-- Choose a Project --</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedProject && (
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <h4 className="font-medium text-slate-900 mb-2">Project Requirements</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.required_skills?.map(skill => (
                                            <Badge key={skill.id} variant="default">{skill.name}</Badge>
                                        ))}
                                        {(!selectedProject.required_skills || selectedProject.required_skills.length === 0) && (
                                            <span className="text-sm text-slate-400 italic">No specific skills listed</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Suggestions */}
                <div className="lg:col-span-2 space-y-4">
                    {!selectedProject ? (
                        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                            <BrainCircuit className="w-12 h-12 mb-4 opacity-50" />
                            <p>Select a project to generate AI suggestions</p>
                        </div>
                    ) : loading ? (
                        <div className="text-center py-12 text-slate-500">
                            <Sparkles className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                            Analyzing team skills and availability...
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-900">Top Matches</h3>
                            {suggestions.map(({ person, score, match_reason }, index) => (
                                <Card key={person.id} className={`transition-all hover:shadow-md ${index === 0 ? 'border-indigo-200 ring-1 ring-indigo-100' : ''}`}>
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${score > 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {score}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="flex items-center">
                                                        <h3 className="text-lg font-semibold text-slate-900">{person.name}</h3>
                                                        {index === 0 && <Badge variant="indigo" className="ml-2">Best Match</Badge>}
                                                    </div>
                                                    <p className="text-sm text-slate-500">{person.role}</p>
                                                    <p className="text-xs text-indigo-600 mt-1 flex items-center">
                                                        <Sparkles className="w-3 h-3 mr-1" />
                                                        {match_reason}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-6">
                                                <div className="text-right">
                                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Availability</div>
                                                    <div className={`font-bold ${person.availability < 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                        {person.availability}%
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                                                    <input
                                                        type="number"
                                                        min="10"
                                                        max="100"
                                                        step="10"
                                                        className="w-16 text-sm border-transparent bg-transparent focus:ring-0 text-right"
                                                        value={allocationEffort}
                                                        onChange={(e) => setAllocationEffort(parseInt(e.target.value))}
                                                    />
                                                    <span className="text-xs text-slate-400 mr-2">%</span>
                                                    <Button size="sm" onClick={() => handleAllocate(person.id)}>
                                                        Allocate
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Allocator;
