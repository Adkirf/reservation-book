'use client';

import { ProtectedRoute } from '@/contexts/ProtectedRoute';
import { useState } from 'react';
import { addUser } from '@/lib/firebase/firestore';
import UserList from '@/components/UserManagement/UserList';

// Admin component for user management
// This component allows admins to view existing users and add new ones
export default function Admin() {
    // State for new user form
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('employee');
    const [message, setMessage] = useState('');

    // Handler for adding a new user
    // Prevents default form submission, adds user to Firestore, and updates UI
    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addUser(email, role);
            setMessage('User added successfully');
            // Reset form fields after successful addition
            setEmail('');
            setRole('employee');
        } catch (error) {
            setMessage('Error adding user');
            console.error('Error adding user:', error);
        }
    };

    return (
        // Wrap component in ProtectedRoute to ensure only admins can access
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">User Management</h1>
                {/* Display list of existing users */}
                <UserList />
                <h2 className="text-xl font-semibold mt-8 mb-4">Add New User</h2>
                {/* Form for adding new users */}
                <form onSubmit={handleAddUser} className="max-w-md">
                    {/* Email input field */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full p-2 mb-2 border rounded"
                    />
                    {/* Role selection dropdown */}
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                    >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                    </select>
                    {/* Submit button for adding new user */}
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Add User</button>
                </form>
                {/* Display success or error message after form submission */}
                {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
            </div>
        </ProtectedRoute>
    );
}

