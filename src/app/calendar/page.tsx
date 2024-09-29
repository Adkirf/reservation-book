'use client';

import { MonthlyView } from '@/components/Calendar/MonthlyView';

// Main component for the Calendar page
export default function CalendarPage() {
    // State to manage the current view type, initialized to 'monthly'

    return (
        // Wrap the component with ReservationProvider for reservation context

        <div className="flex h-full justify-center overflow-hidden"> {/* or any other appropriate height */}
            <MonthlyView />

        </div>
    );
}