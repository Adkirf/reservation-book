import { Month, Months, Reservation } from '@/lib/projectTypes';
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { getReservations, addReservation, updateReservation as updateReservationInFirestore } from '@/lib/firebase/firestore';
import { Drawer } from "@/components/ui/drawer";
import { AddItemForm } from "@/components/Reservation/AddItemForm";

export type ReservationFormData = {
    name: string;
    dateStart: Date;
    dateEnd: Date;
    comment: string;
    numberOfPeople: number;
    contact: string[];
    // Remove reference field
}

// Define the shape of the reservation context
export interface ReservationContextType {
    reservations: Reservation[];
    addingReservation: ReservationFormData | null;
    currentMonth: Month;
    currentYear: number;
    isLoading: boolean;
    setCurrentMonth: (month: Month) => void;
    setCurrentYear: (year: number) => void;
    setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
    updateAddingReservation: (field: keyof ReservationFormData, value: any) => void;
    resetAddingReservation: () => void;
    refreshReservations: () => Promise<void>;
    addNewReservation: (reservation: Omit<Reservation, 'id'>) => Promise<void>;
    editingReservation: Reservation | null;
    setEditingReservation: (reservation: Reservation | null) => void;
    updateEditingReservation: (field: keyof Reservation, value: any) => void;
    updateReservation: (id: string, data: Partial<ReservationFormData>) => Promise<void>;
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
    const [addingReservation, setAddingReservation] = useState<ReservationFormData | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Month>(Months[new Date().getMonth()]);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

    const { user } = useAuth();

    const updateAddingReservation = useCallback((field: keyof ReservationFormData, value: any) => {
        setAddingReservation((prev) => prev ? { ...prev, [field]: value } : null);
    }, []);

    const resetAddingReservation = useCallback(() => {
        setAddingReservation({
            name: "",
            dateStart: new Date(),
            dateEnd: new Date(),
            comment: "",
            numberOfPeople: 1,
            contact: [],
            // Remove reference field
        });
    }, []);

    const fetchReservationsForCurrentMonth = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedReservations = await getReservations();
            console.log('Fetched reservations:', fetchedReservations);
            // Filter reservations for the current month and year
            const filteredReservations = fetchedReservations.filter(reservation => {
                const reservationDate = new Date(reservation.dateStart);
                return reservationDate.getMonth() === Months.indexOf(currentMonth) &&
                    reservationDate.getFullYear() === currentYear;
            });
            setReservations(filteredReservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentMonth, currentYear]);

    useEffect(() => {
        if (user) {
            fetchReservationsForCurrentMonth();
        }
    }, [user, currentMonth, currentYear, fetchReservationsForCurrentMonth]);

    const addNewReservation = useCallback(async (newReservation: Omit<Reservation, 'id'>) => {
        try {
            const id = await addReservation(newReservation);
            const reservationWithId = { ...newReservation, id };
            setReservations(prevReservations => [...prevReservations, reservationWithId]);

            // Check if the new reservation is in the current month and year
            const reservationDate = new Date(newReservation.dateStart);
            if (reservationDate.getMonth() === Months.indexOf(currentMonth) && reservationDate.getFullYear() === currentYear) {
                await fetchReservationsForCurrentMonth();
            }

            resetAddingReservation();
        } catch (error) {
            console.error('Error adding new reservation:', error);
            // Handle error (e.g., show an error message to the user)
        }
    }, [currentMonth, currentYear, fetchReservationsForCurrentMonth, resetAddingReservation]);

    const updateEditingReservation = useCallback((field: keyof Reservation, value: any) => {
        setEditingReservation((prev) => prev ? { ...prev, [field]: value } : null);
    }, []);


    const updateReservation = useCallback(async (id: string, data: Partial<ReservationFormData>) => {
        try {
            await updateReservationInFirestore({ ...data as Reservation, id });
            setReservations((prevReservations) =>
                prevReservations.map((reservation) =>
                    reservation.id === id ? { ...reservation, ...data } : reservation
                )
            );
            // Refresh reservations if the updated reservation might be in the current month/year
            const updatedDate = data.dateStart ? new Date(data.dateStart) : null;
            if (updatedDate &&
                updatedDate.getMonth() === Months.indexOf(currentMonth) &&
                updatedDate.getFullYear() === currentYear) {
                await fetchReservationsForCurrentMonth();
            }
        } catch (error) {
            console.error('Error updating reservation:', error);
            throw error; // Re-throw the error so it can be handled by the caller
        }
    }, [currentMonth, currentYear, fetchReservationsForCurrentMonth]);

    const contextValue = React.useMemo(() => ({
        reservations,
        addingReservation,
        currentMonth,
        currentYear,
        isLoading,
        setCurrentMonth,
        setCurrentYear,
        setReservations,
        updateAddingReservation,
        resetAddingReservation,
        refreshReservations: fetchReservationsForCurrentMonth,
        addNewReservation,
        editingReservation,
        setEditingReservation,
        updateEditingReservation,
        updateReservation,
    }), [
        reservations,
        addingReservation,
        currentMonth,
        currentYear,
        isLoading,
        setCurrentMonth,
        setCurrentYear,
        setReservations,
        updateAddingReservation,
        resetAddingReservation,
        fetchReservationsForCurrentMonth,
        addNewReservation,
        editingReservation,
        setEditingReservation,
        updateEditingReservation,
        updateReservation,
    ]);

    return (
        <ReservationContext.Provider value={contextValue}>
            {children}
            <Drawer open={!!editingReservation} onOpenChange={(open) => !open && setEditingReservation(null)}>
                {editingReservation && (
                    <AddItemForm
                        onClose={() => setEditingReservation(null)}
                        initialData={editingReservation}
                        isEditing={true}
                    />
                )}
            </Drawer>
        </ReservationContext.Provider>
    );
};