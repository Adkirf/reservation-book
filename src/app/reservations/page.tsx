'use client';

import { useState, useEffect } from 'react';
import { getReservationsByMonth } from '@/lib/firebase/firestore';
import ReservationList from '@/components/ReservationList';
import { Reservation } from '@/lib/projectTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations(selectedDate.getFullYear(), selectedDate.getMonth());
    }, [selectedDate]);

    const fetchReservations = async (year: number, month: number) => {
        setLoading(true);
        try {
            const fetchedReservations = await getReservationsByMonth(year, month);
            setReservations(fetchedReservations);
            console.log(fetchedReservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (value: string) => {
        const [year, month] = value.split('-');
        setSelectedDate(new Date(parseInt(year), parseInt(month)));
    };

    const generateMonthOptions = () => {
        const options = [];
        const currentDate = new Date();
        for (let i = 0; i < 6; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
            const value = `${date.getFullYear()}-${date.getMonth()}`;
            const label = MONTHS[date.getMonth()];
            options.push(<SelectItem key={value} value={value}>{label}</SelectItem>);
        }
        return options;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Reservations</h1>
            <div className="mb-4">
                <Select
                    value={`${selectedDate.getFullYear()}-${selectedDate.getMonth()}`}
                    onValueChange={handleMonthChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a month">
                            {MONTHS[selectedDate.getMonth()]}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {generateMonthOptions()}
                    </SelectContent>
                </Select>
            </div>
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