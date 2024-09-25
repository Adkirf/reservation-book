'use client';

import { useAuth } from '../contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace('/login');
            } else if (allowedRoles.length > 0 && !allowedRoles.includes(role as string)) {
                router.replace('/dashboard');
            }
        }
    }, [user, role, loading, router, allowedRoles]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(role as string))) {
        return <div>Not authorized.</div>;
    }

    return <>{children}</>;
};