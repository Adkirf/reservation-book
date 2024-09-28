import { Reservation, Month, Months } from '@/lib/projectTypes';
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { getReservations, addReservation, updateReservation as updateReservationInFirestore } from '@/lib/firebase/firestore';
import { Drawer } from "@/components/ui/drawer";
import { AddItemForm } from "@/components/Reservation/AddItemForm";

export type EditingReservation = Partial<Reservation> | null;

// Define the shape of the reservation context
export interface ReservationContextType {
    reservations: Reservation[];
    editingReservation: EditingReservation;
    isLoading: boolean;
    isDrawerOpen: boolean;
    setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
    setEditingReservation: (reservation: EditingReservation) => void;
    updateEditingReservation: (updateFields: Partial<Reservation>) => void;
    addNewReservation: (reservation: Omit<Reservation, 'id'>) => Promise<void>;
    updateReservation: (id: string, data: Partial<Reservation>) => Promise<void>;
    handleOpenDrawer: () => void;
    handleCloseDrawer: () => void;
    resetEditingReservation: () => void; // Add this new function
    fetchAllReservations: () => Promise<void>;
    getReservationsByMonth: (month: Month, year: number) => Reservation[];
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
    const [editingReservation, setEditingReservation] = useState<EditingReservation>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    const { user } = useAuth();

    const updateEditingReservation = useCallback((updateFields: Partial<Reservation>) => {
        setEditingReservation((prev) => {
            if (prev) {
                return { ...prev, ...updateFields };
            }
            console.log("null update")
            return updateFields;
        });
    }, []);

    const resetEditingReservation = useCallback(() => {
        setEditingReservation({
            name: "",
            dateStart: new Date(),
            dateEnd: new Date(),
            comment: "",
            numberOfPeople: 1,
            contact: [],
        });
    }, []);

    const fetchAllReservations = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedReservations = await getReservations();
            setReservations(fetchedReservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchAllReservations();
        }
    }, [user, fetchAllReservations]);

    const addNewReservation = useCallback(async (newReservation: Omit<Reservation, 'id'>) => {
        try {
            const id = await addReservation(newReservation);
            const reservationWithId = { ...newReservation, id };
            setReservations(prevReservations => [...prevReservations, reservationWithId]);
            resetEditingReservation();
        } catch (error) {
            console.error('Error adding new reservation:', error);
        }
    }, [resetEditingReservation]);

    const updateReservation = useCallback(async (id: string, data: Partial<Reservation>) => {
        try {
            const reservationToUpdate = { id, ...data } as Reservation;
            await updateReservationInFirestore(reservationToUpdate);
            setReservations((prevReservations) =>
                prevReservations.map((reservation) =>
                    reservation.id === id ? { ...reservation, ...data } : reservation
                )
            );
        } catch (error) {
            console.error('Error updating reservation:', error);
            throw error;
        }
    }, []);

    const handleOpenDrawer = useCallback(() => {
        console.log("Opening drawer");
        setIsDrawerOpen(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
        // Don't reset editingReservation here
    }, []);

    const getReservationsByMonth = useCallback((month: Month, year: number) => {
        const monthIndex = Months.indexOf(month);
        return reservations.filter(reservation => {
            const reservationDate = new Date(reservation.dateStart);
            return reservationDate.getMonth() === monthIndex && reservationDate.getFullYear() === year;
        });
    }, [reservations]);

    const contextValue = React.useMemo(() => ({
        reservations,
        editingReservation,
        isLoading,
        isDrawerOpen,
        setReservations,
        setEditingReservation,
        updateEditingReservation,
        fetchAllReservations,
        addNewReservation,
        updateReservation,
        handleOpenDrawer,
        handleCloseDrawer,
        resetEditingReservation,
        getReservationsByMonth,
    }), [
        reservations,
        editingReservation,
        isLoading,
        isDrawerOpen,
        setReservations,
        setEditingReservation,
        updateEditingReservation,
        fetchAllReservations,
        addNewReservation,
        updateReservation,
        handleOpenDrawer,
        handleCloseDrawer,
        resetEditingReservation,
        getReservationsByMonth,
    ]);

    return (
        <ReservationContext.Provider value={contextValue}>
            {children}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                {isDrawerOpen && (
                    <AddItemForm
                        onClose={handleCloseDrawer}
                    />
                )}
            </Drawer>
        </ReservationContext.Provider>
    );
};