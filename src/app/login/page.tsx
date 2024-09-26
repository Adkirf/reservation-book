'use client';

import { useState } from 'react';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/UserManagement/Login';
import { useAuth } from '@/contexts/AuthProvider';

// LoginPage component handles user authentication and redirection
export default function LoginPage() {
    // State to manage and display authentication errors
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    // Access user authentication state from the AuthProvider context
    const { user } = useAuth();

    // Redirect authenticated users to the dashboard
    // This prevents logged-in users from accessing the login page
    if (user) {
        router.replace('/dashboard');
        return null;
    }

    // Handle Google Sign-In process
    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
            // Redirect to dashboard upon successful authentication
            router.push('/dashboard');
        } catch (error) {
            // Display error message if authentication fails
            setError((error as Error).message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4">
            {/* Render the LoginForm component (implementation not shown here) */}
            <LoginForm />
            {/* Conditionally render error message if authentication fails */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}