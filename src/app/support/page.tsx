'use client';

import { useAuth } from '@/contexts/AuthProvider';

export default function SupportPage() {
    const { t } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">{t('support.title')}</h1>
            {/* Add support content here */}
        </div>
    );
}