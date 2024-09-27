import { useState } from 'react';

export default function DailyView() {
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Daily View</h2>
            {/* Implement daily calendar view here */}
            <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setShowAddForm(true)}
            >
                Add Reservation
            </button>

        </div>
    );
}