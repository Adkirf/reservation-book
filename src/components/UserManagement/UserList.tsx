'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { AppUser } from '@/lib/projectTypes';
import { useAuth } from '@/contexts/AuthProvider';

export default function UserList() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const { loading, user } = useAuth();


    useEffect(() => {
        if (!loading) {

        }
    }, []);

    const handleDeleteUser = async (email: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {

            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Current Users</h2>
            <ul className="space-y-2">
                {users.map((user) => (
                    <li key={user.email} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                        <span>{user.email} - {user.role}</span>
                        <button
                            onClick={() => handleDeleteUser(user.email)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}