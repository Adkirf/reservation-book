import { Reservation, ReservationFilterOptions } from '../projectTypes';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import englishTranslations from '../../../public/locales/english.json';
import spanishTranslations from '../../../public/locales/spanish.json';

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


export function getTranslation(key: string, language: string = 'English'): string {
    const keys = key.split('.');
    let value: any = language === 'English' ? englishTranslations : spanishTranslations; // Replace with other language JSONs when available

    for (const k of keys) {
        if (value[k] === undefined) {
            console.warn(`Translation key "${key}" not found for language "${language}"`);
            return key;
        }
        value = value[k];
    }

    return value;
}

