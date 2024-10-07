'use client';

import { MonthlyView } from '@/components/Calendar/MonthlyView';
import { useAuth } from '@/contexts/AuthProvider';

// Main component for the Calendar page
export default function CalendarPage() {
    const { t } = useAuth();

    return (
        <div className="flex flex-col h-full justify-center overflow-hidden">
            <h1 className="text-2xl font-bold mb-4 px-4">{t('calendar.title')}</h1>
            <div className="flex-grow">
                <MonthlyView />
            </div>
        </div>
    );
}