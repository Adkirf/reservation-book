'use client';

import { useState, useEffect } from 'react';
import { useReservation } from '@/contexts/ReservationProvider';
import { useReservationFilters } from '@/hooks/useReservationFilter';
import ReservationList from '@/components/Reservation/ReservationList';
import { Months } from '@/lib/projectTypes';
import MonthSelect from '@/components/MonthSelect';

export default function ReservationsPage() {
    const { items, isLoading, currentMonth, setCurrentMonth } = useReservation();

    const {
        items: filteredItems,
        selectedTab,
        setSelectedTab,
        searchQuery,
        setSearchQuery,
        visibleColumns,
        allColumns,
        defaultColumns,
        toggleColumn,
        updateFilters
    } = useReservationFilters(items);

    console.log('Reservations page re-rendered, items:', filteredItems);

    useEffect(() => {
        updateFilters();
    }, [items, updateFilters]);



    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Reservations</h1>

            {/* Month selector component */}
            <div className="mb-4">
                <MonthSelect />
            </div>

            {/* Conditional rendering based on loading state */}
            {isLoading ? (
                <p>Loading reservations...</p>
            ) : (
                <div>
                    <ReservationList
                        items={filteredItems}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        visibleColumns={visibleColumns}
                        allColumns={allColumns}
                        defaultColumns={defaultColumns}
                        toggleColumn={toggleColumn}
                    />
                </div>
            )}
        </div>
    );
}