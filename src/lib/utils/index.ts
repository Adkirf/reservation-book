import { Reservation } from '../projectTypes';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export interface ReservationFilterOptions {
    searchQuery: string;
    visibleColumns: string[];
    sortConfig: { key: string; direction: 'asc' | 'desc' };
}

export const sortAndFilterReservations = (reservations: Reservation[], options: ReservationFilterOptions): Reservation[] => {
    console.log('sortAndFilterReservations called with options:', options);
    let filteredReservations = [...reservations];

    // Filter by search query
    if (options.searchQuery) {
        const query = options.searchQuery.toLowerCase();
        filteredReservations = filteredReservations.filter(reservation =>
            reservation.name.toLowerCase().includes(query)
        );
    }

    // Sort reservations
    const { key, direction } = options.sortConfig;
    filteredReservations.sort((a, b) => {
        if (key === 'dateStart' || key === 'dateEnd') {
            return direction === 'asc'
                ? new Date(a[key]).getTime() - new Date(b[key]).getTime()
                : new Date(b[key]).getTime() - new Date(a[key]).getTime();
        } else if (key === 'numberOfPeople') {
            return direction === 'asc'
                ? a.numberOfPeople - b.numberOfPeople
                : b.numberOfPeople - a.numberOfPeople;
        } else {
            const aValue = a[key as keyof Reservation] || '';
            const bValue = b[key as keyof Reservation] || '';
            return direction === 'asc'
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        }
    });

    console.log('Filtered and sorted reservations:', filteredReservations);
    return filteredReservations;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

