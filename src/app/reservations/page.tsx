'use client';

import { useState, useEffect } from 'react';
import ReservationList from '@/components/Reservation/ReservationList';
import { Reservation } from '@/lib/projectTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Months } from '@/lib/projectTypes';
// Array of month names for display purposes


export default function ReservationsPage() {
    // State management for reservations, selected date, and loading status
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    // Fetch reservations whenever the selected date changes
    useEffect(() => {
        fetchReservations(selectedDate.getFullYear(), selectedDate.getMonth());
    }, [selectedDate]);

    // Asynchronous function to fetch reservations for a specific month
    const fetchReservations = async (year: number, month: number) => {
        setLoading(true);
        try {
            /* const fetchedReservations = await getReservationsByMonth(year, month);
            setReservations(fetchedReservations); */
        } catch (error) {
            console.error('Error fetching reservations:', error);
            // Note: Error handling could be improved here, e.g., displaying an error message to the user
        } finally {
            setLoading(false);
        }
    };

    // Handler for month selection change
    const handleMonthChange = (value: string) => {
        const [year, month] = value.split('-');
        setSelectedDate(new Date(parseInt(year), parseInt(month)));
    };

    // Generate options for the month selector
    // This function creates a list of the next 6 months from the current date
    const generateMonthOptions = () => {
        const options = [];
        const currentDate = new Date();
        for (let i = 0; i < 6; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
            const value = `${date.getFullYear()}-${date.getMonth()}`;
            const label = Months[date.getMonth()];
            options.push(<SelectItem key={value} value={value}>{label}</SelectItem>);
        }
        return options;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Reservations</h1>
            {/* Month selector component */}
            <div className="mb-4">
                <Select
                    value={`${selectedDate.getFullYear()}-${selectedDate.getMonth()}`}
                    onValueChange={handleMonthChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a month">
                            {Months[selectedDate.getMonth()]}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {generateMonthOptions()}
                    </SelectContent>
                </Select>
            </div>
            {/* Conditional rendering based on loading state */}
            {loading ? (
                <p>Loading reservations...</p>
            ) : (
                <div>
                    <ReservationList reservations={reservations} />
                </div>
            )}
        </div>
    );
}