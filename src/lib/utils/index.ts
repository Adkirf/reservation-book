import { dbItem, FilterOptions, Reservation } from '../projectTypes';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const sortAndFilterDbItems = (items: dbItem[], options: FilterOptions): dbItem[] => {
    console.log('sortAndFilterDbItems called with options:', options);
    let filteredItems = [...items];

    // Filter by type (All, Reservations, Tasks)
    if (options.tab === 'Reservations') {
        filteredItems = filteredItems.filter(item => 'numberOfPeople' in item);
    } else if (options.tab === 'Tasks') {
        filteredItems = filteredItems.filter(item => 'assignedTo' in item);
    }

    // Filter by search query
    if (options.searchQuery) {
        const query = options.searchQuery.toLowerCase();
        filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(query)
        );
    }

    // Sort items
    const { key, direction } = options.sortConfig || { key: 'date', direction: 'asc' };
    filteredItems.sort((a, b) => {
        if (key === 'date') {
            return direction === 'asc'
                ? new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()
                : new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime();
        } else if (key === 'comment') {
            const aHasComment = a.comment && a.comment.trim() !== '';
            const bHasComment = b.comment && b.comment.trim() !== '';
            return direction === 'asc'
                ? Number(aHasComment) - Number(bHasComment)
                : Number(bHasComment) - Number(aHasComment);
        } else if (key === 'numberOfPeople' && (a as Reservation).numberOfPeople && (b as Reservation).numberOfPeople) {
            const aNum = (a as Reservation).numberOfPeople || 0;
            const bNum = (b as Reservation).numberOfPeople || 0;
            return direction === 'asc' ? aNum - bNum : bNum - aNum;
        } else {
            const aValue = (a as any)[key] || '';
            const bValue = (b as any)[key] || '';
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
    });

    console.log('Filtered and sorted items:', filteredItems);
    return filteredItems;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

