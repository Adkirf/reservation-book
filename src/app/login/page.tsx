'use client';

import { useState } from 'react';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/Login';
import { useAuth } from '@/contexts/AuthProvider';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { user } = useAuth();

    // Redirect to dashboard if already logged in
    if (user) {
        router.replace('/dashboard');
        return null;
    }

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
            router.push('/dashboard');
        } catch (error) {
            setError((error as Error).message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4">
            <LoginForm />
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}