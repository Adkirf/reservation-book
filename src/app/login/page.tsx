'use client';

import { useState } from 'react';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/Login';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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