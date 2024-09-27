import { useState, useCallback, useMemo, useEffect } from 'react';
import { dbItem } from '../lib/projectTypes';
import { sortAndFilterDbItems } from "@/lib/utils";

export const useReservationFilters = (initialItems: dbItem[]) => {
    const [items, setItems] = useState<dbItem[]>(initialItems);
    const [selectedTab, setSelectedTab] = useState<'All' | 'Reservations' | 'Tasks'>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [deselectedColumns, setDeselectedColumns] = useState<string[]>([]);

    const defaultColumns = useMemo(() => {
        switch (selectedTab) {
            case 'All':
                return ['name', 'date'];
            case 'Reservations':
                return ['name', 'date', 'numberOfPeople'];
            case 'Tasks':
                return ['name', 'comment'];
            default:
                return ['name', 'date'];
        }
    }, [selectedTab]);

    const allColumns = useMemo(() => {
        switch (selectedTab) {
            case 'All':
                return ['name', 'date', 'comment'];
            case 'Reservations':
                return ['name', 'date', 'numberOfPeople', 'comment'];
            case 'Tasks':
                return ['name', 'date', 'comment'];
            default:
                return ['name', 'date', 'comment'];
        }
    }, [selectedTab]);

    const visibleColumns = useMemo(() => {
        return allColumns.filter(column => !deselectedColumns.includes(column));
    }, [allColumns, deselectedColumns]);

    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'asc' });

    useEffect(() => {
        updateFilters();
    }, [sortConfig, selectedTab, searchQuery, visibleColumns]);

    const sortedItems = useMemo(() => {
        return sortAndFilterDbItems(initialItems, {
            tab: selectedTab,
            searchQuery,
            visibleColumns,
            sortConfig,
        });
    }, [initialItems, selectedTab, searchQuery, visibleColumns, sortConfig]);

    const updateFilters = useCallback(() => {
        const filteredItems = sortAndFilterDbItems(initialItems, {
            tab: selectedTab,
            searchQuery,
            visibleColumns,
            sortConfig,
        });
        console.log('Filtered items:', filteredItems);
        setItems(filteredItems);
    }, [initialItems, selectedTab, searchQuery, visibleColumns, sortConfig]);

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
        sortedItems,  // Add this
        items: sortedItems,  // Replace the old 'items' with sortedItems
        selectedTab,
        setSelectedTab,
        searchQuery,
        setSearchQuery,
        visibleColumns,
        allColumns,
        defaultColumns,
        toggleColumn,
        updateFilters,
        sortConfig,
        requestSort,
    };
};