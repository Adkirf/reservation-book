import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReservation } from '@/contexts/ReservationProvider';
import { DrawerTrigger } from '@/components/ui/drawer';

interface AddItemIconProps {
    onClick: () => void;
}

export function AddItemIcon({ onClick }: AddItemIconProps) {
    return (
        <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
            onClick={onClick}
        >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add new item</span>
        </Button>
    );
}