'use client';

import { useAuth } from '@/contexts/AuthProvider';

export default function Offline() {
    const { t } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">{t('offline.title')}</h1>
            <p>{t('offline.message')}</p>
        </div>
    );
}