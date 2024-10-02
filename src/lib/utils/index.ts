import { Reservation } from '../projectTypes';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export interface ReservationFilterOptions {
    searchQuery: string;
    visibleColumns: string[];
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

    console.log('Filtered reservations:', filteredReservations);
    return filteredReservations;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

