import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AddReservationButton() {
    return (
        <Button
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
            onClick={() => {
                // TODO: Implement the action to open the add reservation form
                console.log('Add reservation clicked');
            }}
        >
            <Plus className="w-6 h-6" />
        </Button>
    );
}