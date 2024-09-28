import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReservation } from '@/contexts/ReservationProvider';

export function AddItemIcon() {
    const { handleOpenDrawer, updateEditingReservation } = useReservation();

    const handleClick = () => {
        // Initialize a new reservation if none exists

        handleOpenDrawer();
    };

    return (
        <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
            onClick={handleClick}
        >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add new item</span>
        </Button>
    );
}