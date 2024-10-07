'use client';

import LoadingCircle from '@/components/ui/LoadingCircle';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Define props for the ProtectedRoute component
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

/**
 * ProtectedRoute: A component that restricts access to its children based on user authentication and role.
 * It redirects unauthenticated users to the login page and unauthorized users to the home page.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Check authentication and authorization once the auth state is loaded
        if (!loading) {
            if (!user) {
                // Redirect to login if user is not authenticated
                router.replace('/login');
            } else if (!allowedRoles.includes(user.role as string)) {
                // Redirect to home if user's role is not in the allowed roles
                router.replace('/');
            }
        }
    }, [user, loading, router, allowedRoles]);

    // Show loading state while auth information is being fetched
    if (loading) {
        return <div className="flex flex-col justify-center items-center h-full w-full">
            <LoadingCircle />
        </div>
    }

    // Render "Not authorized" if user is not authenticated or not authorized
    if (!user || !allowedRoles.includes(user.role as string)) {
        return <div>Not authorized.</div>;
    }

    // Render children components if user is authenticated and authorized
    return <>{children}</>;
};