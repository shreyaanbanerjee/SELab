import React, { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, User } from 'lucide-react';

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

    const addSkill = async (personId, skillName) => {
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
        <div className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Add Personnel</h3>
                        <p className="mt-1 text-sm text-gray-500">Register new team members.</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        value={newPerson.name}
                                        onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        value={newPerson.role}
                                        onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add Person
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {people.map((person) => (
                        <li key={person.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <span className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <User className="h-6 w-6 text-gray-500" />
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-indigo-600">{person.name}</div>
                                            <div className="text-sm text-gray-500">{person.role}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="text-sm text-gray-500">Availability: {person.availability}%</div>
                                        <div className="mt-2 flex space-x-2">
                                            {person.skills && person.skills.map(skill => (
                                                <span key={skill.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {skill.name}
                                                </span>
                                            ))}
                                            <button
                                                onClick={() => addSkill(person.id)}
                                                className="text-xs text-indigo-600 hover:text-indigo-900"
                                            >
                                                + Skill
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default People;
