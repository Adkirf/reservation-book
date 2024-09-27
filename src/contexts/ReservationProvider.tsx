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
    addingItem: FormData | null; // Changed from currentItem to addingItem
    currentMonth: Month;
    currentYear: number;
    isLoading: boolean;
    setCurrentMonth: (month: Month) => void;
    setCurrentYear: (year: number) => void;
    setItems: React.Dispatch<React.SetStateAction<dbItem[]>>;
    updateAddingItem: (field: keyof FormData, value: any) => void; // Changed from updateCurrentItem
    resetAddingItem: () => void; // Changed from resetCurrentItem
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
    const [addingItem, setAddingItem] = useState<FormData | null>(null); // Changed from currentItem
    const [currentMonth, setCurrentMonth] = useState<Month>(Months[new Date().getMonth()]);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { user } = useAuth();

    const updateAddingItem = useCallback((field: keyof FormData, value: any) => {
        setAddingItem((prev) => prev ? { ...prev, [field]: value } : null);
    }, []);

    const resetAddingItem = useCallback(() => {
        setAddingItem({
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

            resetAddingItem();
        } catch (error) {
            console.error('Error adding new item:', error);
            // Handle error (e.g., show an error message to the user)
        }
    }, [currentMonth, currentYear, fetchItemsForCurrentMonth, resetAddingItem]);

    const contextValue: ReservationContextType = {
        items,
        addingItem, // Changed from currentItem
        currentMonth,
        currentYear,
        isLoading,
        setCurrentMonth,
        setCurrentYear,
        setItems,
        updateAddingItem, // Changed from updateCurrentItem
        resetAddingItem, // Changed from resetCurrentItem
        refreshItems: fetchItemsForCurrentMonth,
        addNewItem,
    };

    return (
        <ReservationContext.Provider value={contextValue}>
            {children}
        </ReservationContext.Provider>
    );
};