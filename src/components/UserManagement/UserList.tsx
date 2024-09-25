'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { AppUser } from '@/lib/projectTypes';

export default function UserList() {
    const [users, setUsers] = useState<AppUser[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'users'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userList: AppUser[] = [];
            querySnapshot.forEach((doc) => {
                userList.push({ email: doc.id, ...doc.data() } as AppUser);
            });
            setUsers(userList);
        });

        return () => unsubscribe();
    }, []);

    const handleDeleteUser = async (email: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteDoc(doc(db, 'users', email));
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