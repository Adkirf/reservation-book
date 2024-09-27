'use client';

import { useState } from 'react';
import MonthlyView from '@/components/Dashboard/MonthlyView';
import WeeklyView from '@/components/Dashboard/WeeklyView';
import DailyView from '@/components/Dashboard/DailyView';
import { ReservationProvider } from '@/contexts/ReservationProvider';

// Define the possible view types for the calendar
type ViewType = 'monthly' | 'weekly' | 'daily';

// Main component for the Calendar page
export default function CalendarPage() {
    // State to manage the current view type, initialized to 'monthly'
    const [currentView, setCurrentView] = useState<ViewType>('monthly');

    return (
        // Wrap the component with ReservationProvider for reservation context
        <ReservationProvider>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                {/* View selection buttons */}
                <div className="mb-4">
                    {/* Button for Monthly view */}
                    <button
                        className={`mr-2 px-4 py-2 rounded ${currentView === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setCurrentView('monthly')}
                    >
                        Monthly
                    </button>
                    {/* Button for Weekly view */}
                    <button
                        className={`mr-2 px-4 py-2 rounded ${currentView === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setCurrentView('weekly')}
                    >
                        Weekly
                    </button>
                    {/* Button for Daily view */}
                    <button
                        className={`px-4 py-2 rounded ${currentView === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setCurrentView('daily')}
                    >
                        Daily
                    </button>
                </div>
                {/* Render the appropriate view component based on the current view state */}
                {currentView === 'monthly' && <MonthlyView />}
                {currentView === 'weekly' && <WeeklyView />}
                {currentView === 'daily' && <DailyView />}
            </div>
        </ReservationProvider>
    );
}