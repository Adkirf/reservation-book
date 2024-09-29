'use client';

import { useState } from 'react';
import { MonthlyView } from '@/components/Calendar/MonthlyView';

// Define the possible view types for the calendar

// Main component for the Calendar page
export default function CalendarPage() {
    // State to manage the current view type, initialized to 'monthly'

    return (
        // Wrap the component with ReservationProvider for reservation context

        <div className="flex flex-col flex-grow h-full w-full"> {/* or any other appropriate height */}
            <MonthlyView />

        </div>
    );
}