import { Reservation } from '../projectTypes';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export interface ReservationFilterOptions {
    searchQuery: string;
    visibleColumns: string[];
}

export const sortAndFilterReservations = (reservations: Reservation[], options: ReservationFilterOptions): Reservation[] => {
    let filteredReservations = [...reservations];

    // Filter by search query
    if (options.searchQuery) {
        const query = options.searchQuery.toLowerCase();
        filteredReservations = filteredReservations.filter(reservation =>
            reservation.name.toLowerCase().includes(query)
        );
    }

    return filteredReservations;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

