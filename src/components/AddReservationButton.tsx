'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { addReservation } from '@/lib/firebase/firestore';
import { Reservation } from '@/lib/projectTypes';

export function AddReservationButton() {
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddReservation = async () => {
        if (isAdding) return;
        setIsAdding(true);

        try {
            const currentDate = new Date();
            const newReservation: Omit<Reservation, 'id'> = {
                date: currentDate,
                name: 'New Reservation',
                contact: '',
                numberOfPeople: 1,
                comment: '',
            };

            await addReservation(newReservation);
            router.push('/reservations');
        } catch (error) {
            console.error('Error adding reservation:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Button
            size="icon"
            className="fixed bottom-4 right-4 rounded-full shadow-lg"
            aria-label="Add item"
            onClick={handleAddReservation}
            disabled={isAdding}
        >
            <Plus className="h-6 w-6" />
        </Button>
    );
}