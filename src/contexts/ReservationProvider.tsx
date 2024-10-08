import { Reservation, Month, Months, EditingReservation } from '@/lib/projectTypes';
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { deleteReservation as deleteReservationInFirestore, getReservations, addReservation, updateReservation as updateReservationInFirestore } from '@/lib/firebase/firestore';
import { Drawer } from "@/components/ui/drawer";
import { AddItemForm } from "@/components/Reservation/AddItemForm";



// Define the shape of the reservation context
export interface ReservationContextType {
    reservations: Reservation[];
    currentDate: Date;
    intersectingArrivalHour: number | null;
    intersectingDepartureHour: number | null;
    isEditing: boolean;
    editingReservation: EditingReservation;
    isLoading: boolean;
    isDrawerOpen: boolean;
    setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    setIntersectingArrivalHour: React.Dispatch<React.SetStateAction<number | null>>;
    setIntersectingDepartureHour: React.Dispatch<React.SetStateAction<number | null>>;
    updateEditingReservation: (updateFields: Partial<Reservation>) => void;
    addNewReservation: (reservation: Omit<Reservation, 'id'>) => Promise<void>;
    updateReservation: (id: string, data: Partial<Reservation>) => Promise<void>;
    deleteReservation: (id: string) => Promise<void>;
    handleOpenDrawer: (initialPage?: number) => void; // Updated type
    handleCloseDrawer: () => void;
    resetEditingReservation: () => void;
    resetChanges: () => void;
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
    const { user, settings } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [intersectingArrivalHour, setIntersectingArrivalHour] = useState<number | null>(null);
    const [intersectingDepartureHour, setIntersectingDepartureHour] = useState<number | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isEditing, setIsEditing] = useState(false)
    const [editingReservation, setEditingReservation] = useState<EditingReservation>({
        name: "",
        dateStart: new Date(),
        dateEnd: new Date(),
        comment: "",
        numberOfPeople: settings.numberOfPeople,
        contact: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [initialDrawerPage, setInitialDrawerPage] = useState<number>(0);



    const updateEditingReservation = useCallback((updateFields: Partial<Reservation>) => {
        const { id, ...fieldsWithoutId } = updateFields;
        setIsEditing(!!id);
        console.log("updateEditingReservation", updateFields)
        setEditingReservation((prev) => {
            if (id !== undefined && id !== null) {
                return { ...prev, ...updateFields };
            } else {
                return { ...prev, ...fieldsWithoutId };
            }
        });
    }, []);

    const resetEditingReservation = useCallback(() => {
        console.log("resetting")
        const today = new Date();
        today.setHours(settings.checkInHour, 0, 0, 0);
        const tomorrow = new Date()
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(settings.checkOutHour, 0, 0, 0);
        setIsEditing(false);
        setEditingReservation({
            name: "",
            dateStart: today,
            dateEnd: tomorrow,
            comment: "",
            numberOfPeople: settings.numberOfPeople,
            contact: [],
        });
    }, []);

    const resetChanges = useCallback(() => {
        console.log("resetting changes");
        if (editingReservation.id) {
            const originalReservation = reservations.find(r => r.id === editingReservation.id);
            if (originalReservation) {
                setEditingReservation(originalReservation);
            } else {
                console.error("Original reservation not found");
            }
        } else {
            console.log("No editing reservation id found");
        }
    }, [editingReservation.id, reservations]);

    const fetchAllReservations = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedReservations = await getReservations();
            const sortedReservations = fetchedReservations.sort((a, b) =>
                new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()
            );
            setReservations(sortedReservations);
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

    const deleteReservation = useCallback(async (id: string) => {
        try {
            await deleteReservationInFirestore(id);
            setReservations((prevReservations) =>
                prevReservations.filter((reservation) => reservation.id !== id)
            );
        } catch (error) {
            console.error('Error deleting reservation:', error);
            throw error;
        }
    }, []);

    const getReservationsByMonth = useCallback((month: Month, year: number) => {
        const monthIndex = Months.indexOf(month);
        const monthStart = new Date(year, monthIndex, 1);
        const monthEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

        return reservations.filter(reservation => {
            const reservationStart = new Date(reservation.dateStart);
            const reservationEnd = new Date(reservation.dateEnd);

            return (
                (reservationStart >= monthStart && reservationStart <= monthEnd) ||
                (reservationEnd >= monthStart && reservationEnd <= monthEnd) ||
                (reservationStart <= monthStart && reservationEnd >= monthEnd)
            );
        });
    }, [reservations]);

    const contextValue = React.useMemo(() => ({
        reservations,
        editingReservation,
        isLoading,
        isDrawerOpen,
        currentDate,
        isEditing,
        intersectingArrivalHour,
        intersectingDepartureHour,
        setReservations,
        setCurrentDate,
        setIntersectingArrivalHour,
        setIntersectingDepartureHour,
        setIsEditing,
        updateEditingReservation,
        fetchAllReservations,
        addNewReservation,
        updateReservation,
        deleteReservation,
        handleOpenDrawer,
        handleCloseDrawer,
        resetEditingReservation,
        resetChanges,
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
        resetChanges,
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