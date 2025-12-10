import React, { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, User, Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';

const People = () => {
    const [people, setPeople] = useState([]);
    const [filteredPeople, setFilteredPeople] = useState([]);
    const [newPerson, setNewPerson] = useState({ name: '', role: '', availability: 100 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPeople();
    }, []);

    useEffect(() => {
        const results = people.filter(person =>
            person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredPeople(results);
    }, [searchTerm, people]);

    const fetchPeople = async () => {
        try {
            const response = await api.get('/people/');
            setPeople(response.data);
            setFilteredPeople(response.data);
        } catch (error) {
            toast.error('Failed to fetch personnel');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/people/', newPerson);
            setNewPerson({ name: '', role: '', availability: 100 });
            toast.success('Person added successfully');
            fetchPeople();
        } catch (error) {
            toast.error('Failed to add person');
        }
    };

    const addSkill = async (personId) => {
        const skill = prompt("Enter skill name:");
        if (!skill) return;
        try {
            await api.post(`/people/${personId}/skills`, {}, { params: { skill_name: skill } });
            toast.success('Skill added');
            fetchPeople();
        } catch (error) {
            console.error('Skill error:', error);
            toast.error('Failed to add skill');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Personnel</h1>
                    <p className="text-slate-500 mt-1">Manage your team members and their skills.</p>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-64 sm:text-sm"
                        placeholder="Search people, roles, skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Person Form */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <UserPlus className="w-5 h-5 mr-2 text-indigo-600" />
                                Add New Member
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="e.g. Jane Doe"
                                        value={newPerson.name}
                                        onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="e.g. Senior Developer"
                                        value={newPerson.role}
                                        onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Add Person
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* People List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Loading personnel...</div>
                    ) : filteredPeople.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                            <User className="mx-auto h-12 w-12 text-slate-300" />
                            <h3 className="mt-2 text-sm font-medium text-slate-900">No people found</h3>
                            <p className="mt-1 text-sm text-slate-500">Try adjusting your search or add a new person.</p>
                        </div>
                    ) : (
                        filteredPeople.map((person) => (
                            <Card key={person.id} className="hover:border-indigo-200 transition-colors">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {person.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-semibold text-slate-900">{person.name}</h3>
                                                <p className="text-sm text-slate-500">{person.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-slate-500">Availability</div>
                                            <div className={`text-lg font-bold ${person.availability < 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                {person.availability}%
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {person.skills && person.skills.map(skill => (
                                                <Badge key={skill.id} variant="indigo">
                                                    {skill.name}
                                                </Badge>
                                            ))}
                                            <button
                                                onClick={() => addSkill(person.id)}
                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors border border-dashed border-slate-300"
                                            >
                                                <Plus className="w-3 h-3 mr-1" />
                                                Add Skill
                                            </button>
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

export default People;
