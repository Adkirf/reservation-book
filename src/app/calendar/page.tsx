'use client';

import { useState } from 'react';
import { MobileCalendar } from '@/components/Calendar/MonthlyView';

// Define the possible view types for the calendar

// Main component for the Calendar page
export default function CalendarPage() {
    // State to manage the current view type, initialized to 'monthly'

    return (
        // Wrap the component with ReservationProvider for reservation context

        <div className="w-full">
            <MobileCalendar />

        </div>
    );
}