import { useState, useEffect } from 'react';
import { addReservation } from '@/lib/firebase/firestore';
import { useReservation } from '@/contexts/ReservationProvider';

interface AddReservationFormProps {

}

export default function AddReservationForm({ }: AddReservationFormProps) {



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

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
                    value={"date"}
                    onChange={(e) => { }}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Time</label>
                <input
                    type="time"
                    value={"time"}
                    onChange={(e) => { }}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                    type="text"
                    value={"Name"}
                    onChange={(e) => { }}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Number of Guests</label>
                <input
                    type="number"
                    value={"guests"}
                    onChange={(e) => { }}
                    min="1"
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="flex justify-end">
                <button type="button" onClick={() => { }} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
            </div>
        </form>
    );
}