import React from 'react';
import { Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReservation } from '@/contexts/ReservationProvider';
import { usePathname } from 'next/navigation';

export function AddItemIcon() {
    const { isEditing, setIsEditing, editingReservation, handleOpenDrawer, resetEditingReservation } = useReservation();
    const pathname = usePathname();

    const handleClick = () => {
        // Initialize a new reservation if none exists
        if (isEditing) {
            handleOpenDrawer(1);
        } else if (editingReservation?.id) {
            resetEditingReservation();
            handleOpenDrawer();
        }
        handleOpenDrawer();
    };

    const isReservationList = pathname === '/reservations' || pathname === '/';

    return (
        <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
            onClick={handleClick}
        >
            {isReservationList ? (
                <Plus className="h-6 w-6" />
            ) : isEditing ? (
                <Edit className="h-6 w-6" />
            ) : (
                <Plus className="h-6 w-6" />
            )}
            <span className="sr-only">{isEditing && !isReservationList ? 'Edit item' : 'Add new item'}</span>
        </Button>
    );
}