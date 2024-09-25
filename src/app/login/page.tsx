'use client';

import { useState } from 'react';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

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
        <div>
            <h1>Login</h1>
            <button onClick={handleSignIn}>Sign in with Google</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}