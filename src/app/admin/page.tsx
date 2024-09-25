'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useState } from 'react';
import { addUser } from '@/lib/firebase/firestore';

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

    return (<ProtectedRoute allowedRoles={['admin']}>
        <div>
            <h1>Admin: Add New User</h1>
            <form onSubmit={handleAddUser}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Add User</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    </ProtectedRoute>);
}

