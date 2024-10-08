'use client';

import { MonthlyView } from '@/components/Calendar/MonthlyView';
import { useAuth } from '@/contexts/AuthProvider';

// Main component for the Calendar page
export default function CalendarPage() {
    const { t } = useAuth();

    return (
        <div className="flex flex-col h-full justify-center overflow-hidden">
            <div className="flex-grow">
                <MonthlyView />
            </div>
        </div>
    );
}