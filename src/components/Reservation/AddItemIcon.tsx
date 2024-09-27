import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReservation } from '@/contexts/ReservationProvider';
import { DrawerTrigger } from '@/components/ui/drawer';

export function AddItemIcon() {
    const { addingItem, resetAddingItem } = useReservation();

    const handleClick = () => {
        // Only reset if there's no existing data
        if (!addingItem) {
            resetAddingItem();
        }
    };

    return (
        <DrawerTrigger asChild>
            <Button
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
                onClick={handleClick}
            >
                <Plus className="w-6 h-6" />
            </Button>
        </DrawerTrigger>
    );
}