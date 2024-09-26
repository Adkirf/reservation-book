'use client';

import { useState } from 'react';
import MonthlyView from '@/components/Dashboard/MonthlyView';
import WeeklyView from '@/components/Dashboard/WeeklyView';
import DailyView from '@/components/Dashboard/DailyView';
import { ReservationProvider } from '@/contexts/ReservationProvider';

type ViewType = 'monthly' | 'weekly' | 'daily';

export default function CalendarPage() {
    const [currentView, setCurrentView] = useState<ViewType>('monthly');

    return (
        <ReservationProvider>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <div className="mb-4">
                    <button
                        className={`mr-2 px-4 py-2 rounded ${currentView === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setCurrentView('monthly')}
                    >
                        Monthly
                    </button>
                    <button
                        className={`mr-2 px-4 py-2 rounded ${currentView === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setCurrentView('weekly')}
                    >
                        Weekly
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${currentView === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setCurrentView('daily')}
                    >
                        Daily
                    </button>
                </div>
                {currentView === 'monthly' && <MonthlyView />}
                {currentView === 'weekly' && <WeeklyView />}
                {currentView === 'daily' && <DailyView />}
            </div>
        </ReservationProvider>
    );
}