'use client';

import { useState } from 'react';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/UserManagement/LoginForm';
import { useAuth } from '@/contexts/AuthProvider';

// LoginPage component handles user authentication and redirection
export default function LoginPage() {
    // State to manage and display authentication errors
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    // Access user authentication state from the AuthProvider context
    const { user, t } = useAuth();

    // Redirect authenticated users to the dashboard
    // This prevents logged-in users from accessing the login page
    if (user) {
        router.replace('/');
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4">
            {/* Render the LoginForm component (implementation not shown here) */}
            <h1 className="text-2xl font-bold mb-4">{t('login.title')}</h1>
            <LoginForm />
            {/* Conditionally render error message if authentication fails */}
            {error && <p className="text-red-500 mt-2">{t('login.error')}</p>}
        </div>
    );
}