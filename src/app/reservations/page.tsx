'use client';

import ReservationList from '@/components/Reservation/ReservationList';
import { useReservationFilters } from '@/hooks/useReservationFilter';
import { useReservation } from '@/contexts/ReservationProvider';

export default function ReservationsPage() {
    const { reservations } = useReservation();
    const {
        paginatedReservations,
        searchQuery,
        setSearchQuery,
        visibleColumns,
        toggleColumn,
        currentPage,
        setCurrentPage,
        totalPages,
        setItemsPerPage
    } = useReservationFilters(reservations);

    return (
        <div className="flex h-full mx-auto">
            <ReservationList
                reservations={paginatedReservations}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                visibleColumns={visibleColumns}
                toggleColumn={toggleColumn}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                setItemsPerPage={setItemsPerPage}
            />
        </div>
    );
}