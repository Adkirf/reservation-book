import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReservation } from '@/contexts/ReservationProvider';

export function AddItemIcon() {
    const { isEditing, setIsEditing, editingReservation, handleOpenDrawer, resetEditingReservation } = useReservation();

    const handleClick = () => {
        // Initialize a new reservation if none exists
        if (isEditing) {
            setIsEditing(false);
            handleOpenDrawer(1);
        } else if (editingReservation?.id) {
            resetEditingReservation();
            handleOpenDrawer();
        }



    };

    return (
        <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
            onClick={handleClick}
        >
            {isEditing ? (
                <X className="h-6 w-6" />
            ) : (
                <Plus className="h-6 w-6" />
            )}
            <span className="sr-only">{isEditing ? 'Cancel editing' : 'Add new item'}</span>
        </Button>
    );
}