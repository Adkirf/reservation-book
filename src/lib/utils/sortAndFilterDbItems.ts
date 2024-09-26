import { dbItem } from '../projectTypes';

interface FilterOptions {
    tab: 'All' | 'Reservations' | 'Tasks';
    searchQuery: string;
    visibleColumns: string[];
}

export const sortAndFilterDbItems = (items: dbItem[], options: FilterOptions): dbItem[] => {
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

    // Sort items by date
    filteredItems.sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());

    console.log('Filtered and sorted items:', filteredItems);
    return filteredItems;
}