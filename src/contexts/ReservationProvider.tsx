import { dbItem, Month, Months, Reservation, Task } from '@/lib/projectTypes';
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { fetchItemsForMonth } from '@/lib/firebase/firestore';



// Define the shape of the reservation context
export interface ReservationContextType {
    reservations: Reservation[];
    tasks: Task[];
    currentItem: dbItem | null;
    currentMonth: Month;
    isLoading: boolean;
    setCurrentMonth: (month: Month) => void;
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
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentItem, setCurrentItem] = useState<dbItem | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Month>(Months[new Date().getMonth()]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { user } = useAuth();

    const fetchItemsForCurrentMonth = useCallback(async () => {
        setIsLoading(true);
        const currentYear = new Date().getFullYear();

        try {
            const { reservations: fetchedReservations, tasks: fetchedTasks } = await fetchItemsForMonth(currentMonth, currentYear);
            setReservations(fetchedReservations);
            setTasks(fetchedTasks);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentMonth]);

    useEffect(() => {
        if (user) {
            fetchItemsForCurrentMonth();
        }
    }, [user, currentMonth, fetchItemsForCurrentMonth]);

    const contextValue: ReservationContextType = {
        reservations,
        tasks,
        currentItem,
        currentMonth,
        isLoading,
        setCurrentMonth,
        refreshItems: fetchItemsForCurrentMonth,
    };

    return (
        <ReservationContext.Provider value={contextValue}>
            {children}
        </ReservationContext.Provider>
    );
};