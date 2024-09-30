import { Reservation, Month, Months } from '@/lib/projectTypes';
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { getReservations, addReservation, updateReservation as updateReservationInFirestore } from '@/lib/firebase/firestore';
import { Drawer } from "@/components/ui/drawer";
import { AddItemForm } from "@/components/Reservation/AddItemForm";
import { userSetting } from '@/lib/settings';

export type EditingReservation = Partial<Reservation> | null;

// Define the shape of the reservation context
export interface ReservationContextType {
    reservations: Reservation[];
    currentDate: Date;
    isEditing: boolean;
    editingReservation: EditingReservation;
    isLoading: boolean;
    isDrawerOpen: boolean;
    setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    setEditingReservation: (reservation: EditingReservation) => void;
    updateEditingReservation: (updateFields: Partial<Reservation>) => void;
    addNewReservation: (reservation: Omit<Reservation, 'id'>) => Promise<void>;
    updateReservation: (id: string, data: Partial<Reservation>) => Promise<void>;
    handleOpenDrawer: (initialPage?: number) => void; // Updated type
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
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isEditing, setIsEditing] = useState(false)
    const [editingReservation, setEditingReservation] = useState<EditingReservation>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [initialDrawerPage, setInitialDrawerPage] = useState<number>(0);

    const { user } = useAuth();

    const updateEditingReservation = useCallback((updateFields: Partial<Reservation>) => {
        setEditingReservation((prev) => {
            if (prev) {
                return { ...prev, ...updateFields };
            }
            console.log("null update")
            return updateFields;
        });
        console.log(updateFields)
    }, []);

    const resetEditingReservation = useCallback(() => {
        console.log("resetting")
        setEditingReservation({
            name: "",
            dateStart: new Date(),
            dateEnd: new Date(),
            comment: "",
            numberOfPeople: userSetting.numberOfPeople,
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
    }, []);

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

    const handleOpenDrawer = useCallback((initialPage: number = 0) => {
        setInitialDrawerPage(initialPage);
        setIsDrawerOpen(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {

        setIsDrawerOpen(false);
    }, [editingReservation, resetEditingReservation]);

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
        currentDate,
        isEditing,
        setReservations,
        setEditingReservation,
        setCurrentDate,
        setIsEditing,
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
        currentDate,
        isEditing,
        setReservations,
        setEditingReservation,
        setCurrentDate,
        setIsEditing,
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
            <Drawer
                open={isDrawerOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleCloseDrawer();
                    } else {
                        setIsDrawerOpen(true);
                    }
                }}
            >
                {isDrawerOpen && (
                    <AddItemForm
                        onClose={handleCloseDrawer}
                        initialPage={initialDrawerPage}
                    />
                )}
            </Drawer>
        </ReservationContext.Provider>
    );
};