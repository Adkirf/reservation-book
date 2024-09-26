import { dbItem, Month, Months } from '@/lib/projectTypes';
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { fetchItemsForMonth } from '@/lib/firebase/firestore';

// Define the shape of the reservation context
export interface ReservationContextType {
    items: dbItem[];
    currentItem: dbItem | null;
    currentMonth: Month;
    currentYear: number;
    isLoading: boolean;
    setCurrentMonth: (month: Month) => void;
    setCurrentYear: (year: number) => void;
    setItems: React.Dispatch<React.SetStateAction<dbItem[]>>;
    refreshItems: () => Promise<void>;
}

// Create a context for reservation data
const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

/**
 * Custom hook to access the reservation context
 * Throws an error if used outside of ReservationProvider
 */
export const useReservation = () => {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error('useReservation must be used within a ReservationProvider');
    }
    return context;
};

interface ReservationProviderProps {
    children: ReactNode;
}

/**
 * ReservationProvider: Manages reservation state and provides methods to update it
 * Wraps child components with ReservationContext.Provider
 */
export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
    const [items, setItems] = useState<dbItem[]>([]);
    const [currentItem, setCurrentItem] = useState<dbItem | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Month>(Months[new Date().getMonth()]);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { user } = useAuth();

    const fetchItemsForCurrentMonth = useCallback(async () => {
        setIsLoading(true);
        try {
            const { reservations, tasks } = await fetchItemsForMonth(currentMonth, currentYear);
            console.log('Fetched items:', { reservations, tasks });
            setItems([...reservations, ...tasks]);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentMonth, currentYear]);

    useEffect(() => {
        if (user) {
            fetchItemsForCurrentMonth();
        }
    }, [user, currentMonth, currentYear, fetchItemsForCurrentMonth]);

    const contextValue: ReservationContextType = {
        items,
        currentItem,
        currentMonth,
        currentYear,
        isLoading,
        setCurrentMonth,
        setCurrentYear,
        setItems,
        refreshItems: fetchItemsForCurrentMonth,
    };

    return (
        <ReservationContext.Provider value={contextValue}>
            {children}
        </ReservationContext.Provider>
    );
};