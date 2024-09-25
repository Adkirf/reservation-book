'use client';

import { useState, useEffect } from 'react';
import { getReservationsByMonth } from '@/lib/firebase/firestore';
import ReservationList from '@/components/ReservationList';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations(selectedDate.getFullYear(), selectedDate.getMonth());
    }, [selectedDate]);

    const fetchReservations = async (year: number, month: number) => {
        setLoading(true);
        try {
            const fetchedReservations = await getReservationsByMonth(year, month);
            //setReservations(fetchedReservations);
            console.log(fetchedReservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const [year, month] = event.target.value.split('-');
        setSelectedDate(new Date(parseInt(year), parseInt(month)));
    };

    const generateMonthOptions = () => {
        const options = [];
        const currentDate = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const value = `${date.getFullYear()}-${date.getMonth()}`;
            const label = `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
            options.push(<option key={value} value={value}>{label}</option>);
        }
        return options;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Reservations</h1>
            <div className="mb-4">
                <label htmlFor="month-select" className="mr-2">Select month:</label>
                <select
                    id="month-select"
                    value={`${selectedDate.getFullYear()}-${selectedDate.getMonth()}`}
                    onChange={handleMonthChange}
                    className="border rounded p-2"
                >
                    {generateMonthOptions()}
                </select>
            </div>
            {loading ? (
                <p>Loading reservations...</p>
            ) : (
                <div>
                    Heres come the reservations
                </div>
            )}
        </div>
    );
}