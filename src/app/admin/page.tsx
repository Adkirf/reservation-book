'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useState } from 'react';
import { addUser } from '@/lib/firebase/firestore';
import UserList from '@/components/UserManagement/UserList';

export default function Admin() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('employee');
    const [message, setMessage] = useState('');

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addUser(email, role);
            setMessage('User added successfully');
            setEmail('');
            setRole('employee');
        } catch (error) {
            setMessage('Error adding user');
            console.error('Error adding user:', error);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">User Management</h1>
                <UserList />
                <h2 className="text-xl font-semibold mt-8 mb-4">Add New User</h2>
                <form onSubmit={handleAddUser} className="max-w-md">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                    >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Add User</button>
                </form>
                {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
            </div>
        </ProtectedRoute>
    );
}

