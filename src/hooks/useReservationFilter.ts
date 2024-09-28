import { useState, useCallback, useMemo, useEffect } from 'react';
import { allColumns, defaultColumns, Reservation } from '../lib/projectTypes';
import { sortAndFilterReservations } from "@/lib/utils";
import { format } from 'date-fns';

export const useReservationFilters = (initialReservations: Reservation[]) => {
    const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [deselectedColumns, setDeselectedColumns] = useState<string[]>(() => {
        return allColumns.filter(column => !defaultColumns.includes(column));
    });

    const visibleColumns = useMemo(() => {
        return allColumns.filter(column => !deselectedColumns.includes(column));
    }, [deselectedColumns]);

    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'dateStart', direction: 'asc' });

    useEffect(() => {
        updateFilters();
    }, [sortConfig, searchQuery, visibleColumns]);

    const sortedReservations = useMemo(() => {
        return sortAndFilterReservations(initialReservations, {
            searchQuery,
            visibleColumns,
            sortConfig,
        }).map(reservation => ({
            ...reservation,
            date: formatDateRange(reservation.dateStart, reservation.dateEnd)
        }));
    }, [initialReservations, searchQuery, visibleColumns, sortConfig]);

    const updateFilters = useCallback(() => {
        const filteredReservations = sortAndFilterReservations(initialReservations, {
            searchQuery,
            visibleColumns,
            sortConfig,
        });
        console.log('Filtered reservations:', filteredReservations);
        setReservations(filteredReservations);
    }, [initialReservations, searchQuery, visibleColumns, sortConfig]);

    const requestSort = (key: string) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const toggleColumn = (column: string) => {
        setDeselectedColumns(prev => {
            if (prev.includes(column)) {
                return prev.filter(c => c !== column);
            } else {
                // Prevent deselecting if it's the last visible column
                if (visibleColumns.length > 1) {
                    return [...prev, column];
                }
                return prev;
            }
        });
    };

    return {
        sortedReservations,
        reservations: sortedReservations,
        searchQuery,
        setSearchQuery,
        visibleColumns,
        allColumns,
        defaultColumns,
        toggleColumn,
        updateFilters,
        sortConfig,
        requestSort,
        formatDateRange, // Add this function to the returned object
    };
};

// Add this function outside of the hook
function formatDateRange(dateStart: Date, dateEnd: Date): string {
    if (!dateStart || !dateEnd) return '';
    return `${format(dateStart, 'dd')} - ${format(dateEnd, 'dd.MM')}`;
}