import { useState } from 'react';
import AddReservationForm from '../Reservation/AddReservationForm';

export default function WeeklyView() {
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Weekly View</h2>
            {/* Implement weekly calendar view here */}
            <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setShowAddForm(true)}
            >
                Add Reservation
            </button>
            {showAddForm && (
                <AddReservationForm
                    initialDate={new Date()}
                    onClose={() => setShowAddForm(false)}
                />
            )}
        </div>
    );
}