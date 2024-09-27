import { dbItem, Month, Months, Reservation, Task } from '@/lib/projectTypes';
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { fetchItemsForMonth, addItem } from '@/lib/firebase/firestore';

export type FormData = {
    type: "reservation" | "task";
    name: string;
    dateStart: Date;
    dateEnd: Date;
    comment: string;
    numberOfPeople: number;
    contact: string[];
    assignedTo: string;
    reference: string;
}

// Define the shape of the reservation context
export interface ReservationContextType {
    items: dbItem[];
    currentItem: FormData | null;
    currentMonth: Month;
    currentYear: number;
    isLoading: boolean;
    setCurrentMonth: (month: Month) => void;
    setCurrentYear: (year: number) => void;
    setItems: React.Dispatch<React.SetStateAction<dbItem[]>>;
    updateCurrentItem: (field: keyof FormData, value: any) => void;
    resetCurrentItem: () => void;
    refreshItems: () => Promise<void>;
    addNewItem: (item: Omit<dbItem, 'id'>) => Promise<void>;
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
    const [currentItem, setCurrentItem] = useState<FormData | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Month>(Months[new Date().getMonth()]);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { user } = useAuth();

    const updateCurrentItem = useCallback((field: keyof FormData, value: any) => {
        setCurrentItem((prev) => prev ? { ...prev, [field]: value } : null);
    }, []);

    const resetCurrentItem = useCallback(() => {
        setCurrentItem({
            type: "reservation",
            name: "",
            dateStart: new Date(),
            dateEnd: new Date(),
            comment: "",
            numberOfPeople: 1,
            contact: [],
            assignedTo: "",
            reference: "",
        });
    }, []);

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

    const addNewItem = useCallback(async (newItem: Omit<dbItem, 'id'>) => {
        try {
            const id = await addItem(newItem);
            const itemWithId = { ...newItem, id };
            setItems(prevItems => [...prevItems, itemWithId]);

            // Check if the new item is in the current month and year
            const itemDate = new Date(newItem.dateStart);
            if (itemDate.getMonth() === Months.indexOf(currentMonth) && itemDate.getFullYear() === currentYear) {
                await fetchItemsForCurrentMonth();
            }

            resetCurrentItem();
        } catch (error) {
            console.error('Error adding new item:', error);
            // Handle error (e.g., show an error message to the user)
        }
    }, [currentMonth, currentYear, fetchItemsForCurrentMonth, resetCurrentItem]);

    const contextValue: ReservationContextType = {
        items,
        currentItem,
        currentMonth,
        currentYear,
        isLoading,
        setCurrentMonth,
        setCurrentYear,
        setItems,
        updateCurrentItem,
        resetCurrentItem,
        refreshItems: fetchItemsForCurrentMonth,
        addNewItem,
    };

    return (
        <ReservationContext.Provider value={contextValue}>
            {children}
        </ReservationContext.Provider>
    );
};