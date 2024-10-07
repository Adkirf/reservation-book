'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { UserRole } from '@/lib/projectTypes';
import LoadingCircle from '@/components/ui/LoadingCircle';

// Define props for the ProtectedRoute component
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

/**
 * ProtectedRoute: A component that restricts access to its children based on user authentication and role.
 * It redirects unauthenticated users to the login page and unauthorized users to the home page.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, loading, t } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Check authentication and authorization once the auth state is loaded
        if (!loading && (!user || !allowedRoles.includes(user.role))) {
            // Redirect to login if user is not authenticated
            router.push('/login');
        }
    }, [user, loading, allowedRoles, router]);

    // Show loading state while auth information is being fetched
    if (loading) {
        return <LoadingCircle />;
    }

    // Render "Not authorized" if user is not authenticated or not authorized
    if (!user || !allowedRoles.includes(user.role)) {
        return <div>{t('protectedRoute.unauthorized')}</div>;
    }

    // Render children components if user is authenticated and authorized
    return <>{children}</>;
};