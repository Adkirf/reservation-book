import { useState, useCallback } from 'react';
import { dbItem } from '../lib/projectTypes';
import { sortAndFilterDbItems } from '@/lib/utils/sortAndFilterDbItems';

export const useReservationFilters = (initialItems: dbItem[]) => {
    const [items, setItems] = useState<dbItem[]>(initialItems);
    const [selectedTab, setSelectedTab] = useState<'All' | 'Reservations' | 'Tasks'>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [visibleColumns, setVisibleColumns] = useState<string[]>(['name', 'dateStart', 'numberOfPeople']);

    const updateFilters = useCallback(() => {
        const filteredItems = sortAndFilterDbItems(initialItems, {
            tab: selectedTab,
            searchQuery,
            visibleColumns,
        });
        console.log('Filtered items:', filteredItems);
        setItems(filteredItems);
    }, [initialItems, selectedTab, searchQuery, visibleColumns]);

    return {
        items,
        selectedTab,
        setSelectedTab,
        searchQuery,
        setSearchQuery,
        visibleColumns,
        setVisibleColumns,
        updateFilters,
    };
};