import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ReservationContextType {
    date: string;
    time: string;
    name: string;
    guests: number;
    updateReservation: (field: string, value: string | number) => void;
    resetReservation: () => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

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

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
    const [reservation, setReservation] = useState({
        date: '',
        time: '12:00',
        name: '',
        guests: 1,
    });

    const updateReservation = (field: string, value: string | number) => {
        setReservation(prev => ({ ...prev, [field]: value }));
    };

    const resetReservation = () => {
        setReservation({
            date: '',
            time: '12:00',
            name: '',
            guests: 1,
        });
    };

    return (
        <ReservationContext.Provider value={{ ...reservation, updateReservation, resetReservation }}>
            {children}
        </ReservationContext.Provider>
    );
};