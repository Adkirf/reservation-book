'use client';

import { useState } from 'react';
import { ReservationProvider } from '@/contexts/ReservationProvider';
import { MobileCalendar } from '@/components/Calendar/MonthlyView';

// Define the possible view types for the calendar
type ViewType = 'monthly' | 'weekly' | 'daily';

// Main component for the Calendar page
export default function CalendarPage() {
    // State to manage the current view type, initialized to 'monthly'
    const [currentView, setCurrentView] = useState<ViewType>('monthly');

    return (
        // Wrap the component with ReservationProvider for reservation context
        <ReservationProvider>
            <div className="">
                <MobileCalendar />

            </div>
        </ReservationProvider>
    );
}