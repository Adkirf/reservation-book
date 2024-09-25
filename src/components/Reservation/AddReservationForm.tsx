import { useState, useEffect } from 'react';
import { addReservation } from '@/lib/firebase/firestore';
import { useReservation } from '@/contexts/ReservationProvider';

interface AddReservationFormProps {
    initialDate: Date;
    onClose: () => void;
}

export default function AddReservationForm({ initialDate, onClose }: AddReservationFormProps) {
    const { date, time, name, guests, updateReservation, resetReservation } = useReservation();

    useEffect(() => {
        // Set the initial date when the form is opened
        updateReservation('date', initialDate.toISOString().split('T')[0]);
    }, [initialDate, updateReservation]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addReservation({
                date,
                time,
                name,
                guests,
            });
            resetReservation();
            onClose();
        } catch (error) {
            console.error('Error adding reservation:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Add Reservation</h3>
            <div className="mb-4">
                <label className="block mb-1">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => updateReservation('date', e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Time</label>
                <input
                    type="time"
                    value={time}
                    onChange={(e) => updateReservation('time', e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => updateReservation('name', e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Number of Guests</label>
                <input
                    type="number"
                    value={guests}
                    onChange={(e) => updateReservation('guests', parseInt(e.target.value))}
                    min="1"
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="flex justify-end">
                <button type="button" onClick={() => { resetReservation(); onClose(); }} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
            </div>
        </form>
    );
}