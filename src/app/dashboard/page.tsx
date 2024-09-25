'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Dashboard() {
    return (
        <ProtectedRoute allowedRoles={['employee', 'admin']}>
            <div>Dashboard page</div>
        </ProtectedRoute>
    );
}