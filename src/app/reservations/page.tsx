'use client';

import { useState, useEffect } from 'react';
import { useReservation } from '@/contexts/ReservationProvider';
import { useReservationFilters } from '@/hooks/useReservationFilter';
import ReservationList from '@/components/Reservation/ReservationList';
import { Months, allColumns, defaultColumns } from '@/lib/projectTypes';
import LoadingCircle from '@/components/ui/LoadingCircle';

export default function ReservationsPage() {
    const { reservations, isLoading } = useReservation();

    const {
        sortedReservations,
        searchQuery,
        setSearchQuery,
        visibleColumns,
        toggleColumn,
        updateFilters
    } = useReservationFilters(reservations);


    useEffect(() => {
        updateFilters();
    }, [reservations, updateFilters]);

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="px-4 py-8 flex-grow overflow-hidden">
                {isLoading ? <LoadingCircle /> : (
                    <ReservationList
                        reservations={sortedReservations}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        visibleColumns={visibleColumns}
                        toggleColumn={toggleColumn}
                    />
                )}
            </div>
        </div>
    );
}