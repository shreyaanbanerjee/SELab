import React, { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, User, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const People = () => {
    const [people, setPeople] = useState([]);
    const [newPerson, setNewPerson] = useState({ name: '', role: '', availability: 100 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPeople();
    }, []);

    const fetchPeople = async () => {
        try {
            const response = await api.get('/people/');
            setPeople(response.data);
        } catch (error) {
            console.error('Error fetching people:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/people/', newPerson);
            setNewPerson({ name: '', role: '', availability: 100 });
            fetchPeople();
        } catch (error) {
            console.error('Error creating person:', error);
        }
    };

    const addSkill = async (personId) => {
        const skill = prompt("Enter skill name:");
        if (!skill) return;
        try {
            await api.post(`/people/${personId}/skills?skill_name=${skill}`);
            fetchPeople();
        } catch (error) {
            console.error('Error adding skill:', error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Personnel</h1>
                    <p className="text-slate-500 mt-1">Manage your team members and their skills.</p>
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
                    ) : (
                        people.map((person) => (
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
