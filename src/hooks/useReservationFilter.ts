import { useState, useCallback, useMemo, useEffect } from 'react';
import { allColumns, defaultColumns, Reservation } from '../lib/projectTypes';
import { sortAndFilterReservations } from "@/lib/utils";
import { format } from 'date-fns';

export const useReservationFilters = (initialReservations: Reservation[]) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [deselectedColumns, setDeselectedColumns] = useState<string[]>(() => {
        return allColumns.filter(column => !defaultColumns.includes(column));
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const visibleColumns = useMemo(() => {
        return allColumns.filter(column => !deselectedColumns.includes(column));
    }, [deselectedColumns]);

    const sortedReservations = useMemo(() => {
        return sortAndFilterReservations(initialReservations, {
            searchQuery,
            visibleColumns,
        })
            .sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime())
            .map(reservation => ({
                ...reservation,
                date: formatDateRange(reservation.dateStart, reservation.dateEnd)
            }));
    }, [initialReservations, searchQuery, visibleColumns]);

    const paginatedReservations = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedReservations.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedReservations, currentPage, itemsPerPage]); // Add itemsPerPage to the dependency array

    const toggleColumn = (column: string) => {
        setDeselectedColumns(prev => {
            if (prev.includes(column)) {
                return prev.filter(c => c !== column);
            } else {
                if (visibleColumns.length > 1) {
                    return [...prev, column];
                }
                return prev;
            }
        });
    };

    const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);

    return {
        paginatedReservations,
        searchQuery,
        setSearchQuery,
        visibleColumns,
        allColumns,
        defaultColumns,
        toggleColumn,
        formatDateRange,
        currentPage,
        setCurrentPage,
        totalPages,
        totalReservations: sortedReservations.length,
        setItemsPerPage,
    };
};

// Add this function outside of the hook
function formatDateRange(dateStart: Date, dateEnd: Date): string {
    if (!dateStart || !dateEnd) return '';
    return `${format(dateStart, 'dd')} - ${format(dateEnd, 'dd.MM')}`;
}