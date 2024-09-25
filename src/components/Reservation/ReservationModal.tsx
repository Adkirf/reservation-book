import { useState } from 'react';
import { updateReservation, deleteReservation } from '@/lib/firebase/firestore';

interface ReservationModalProps {
    reservation: {
        id: string;
        date: string;
        time: string;
        name: string;
        guests: number;
    };
    onClose: () => void;
}

export default function ReservationModal({ reservation, onClose }: ReservationModalProps) {
    const [date, setDate] = useState(reservation.date);
    const [time, setTime] = useState(reservation.time);
    const [name, setName] = useState(reservation.name);
    const [guests, setGuests] = useState(reservation.guests);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateReservation(reservation.id, {
                date,
                time,
                name,
                guests,
            });
            onClose();
        } catch (error) {
            console.error('Error updating reservation:', error);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this reservation?')) {
            try {
                await deleteReservation(reservation.id);
                onClose();
            } catch (error) {
                console.error('Error deleting reservation:', error);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">Edit Reservation</h3>
                <div className="mb-4">
                    <label className="block mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Time</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Number of Guests</label>
                    <input
                        type="number"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        min="1"
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex justify-end">
                    <button type="button" onClick={handleDelete} className="mr-2 px-4 py-2 bg-red-500 text-white rounded">Delete</button>
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                </div>
            </form>
        </div>
    );
}