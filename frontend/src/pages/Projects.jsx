import React, { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, Briefcase, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects/');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects/', newProject);
            setNewProject({ name: '', description: '' });
            fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const addSkill = async (projectId) => {
        const skill = prompt("Enter required skill name:");
        if (!skill) return;
        try {
            await api.post(`/projects/${projectId}/skills?skill_name=${skill}`);
            fetchProjects();
        } catch (error) {
            console.error('Error adding skill:', error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Projects</h1>
                    <p className="text-slate-500 mt-1">Track active projects and their requirements.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Project Form */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <PlusCircle className="w-5 h-5 mr-2 text-indigo-600" />
                                New Project
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="e.g. Mobile App Redesign"
                                        value={newProject.name}
                                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        rows={3}
                                        placeholder="Brief description of the project..."
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Create Project
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Projects List */}
                <div className="lg:col-span-2 grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Loading projects...</div>
                    ) : (
                        projects.map((project) => (
                            <Card key={project.id} className="hover:border-indigo-200 transition-colors">
                                <CardContent className="p-5">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <Briefcase className="h-6 w-6 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                                                <Badge variant={project.status === 'Active' ? 'success' : 'default'}>
                                                    {project.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.description}</p>

                                            <div className="mt-4 flex items-center flex-wrap gap-2">
                                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mr-2">Required Skills:</span>
                                                {project.required_skills && project.required_skills.map(skill => (
                                                    <Badge key={skill.id} variant="warning">
                                                        {skill.name}
                                                    </Badge>
                                                ))}
                                                <button
                                                    onClick={() => addSkill(project.id)}
                                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors border border-dashed border-slate-300"
                                                >
                                                    <Plus className="w-3 h-3 mr-1" />
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Projects;
