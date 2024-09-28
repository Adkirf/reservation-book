"use client"

import { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Reservation } from '@/lib/projectTypes'
import ReservationTable from './ReservationTable'

interface ReservationListProps {
    reservations: Reservation[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    visibleColumns: string[];

    toggleColumn: (column: string) => void;
}

export default function ReservationList({
    reservations,
    searchQuery,
    setSearchQuery,
    visibleColumns,
    toggleColumn
}: ReservationListProps) {
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>(reservations);

    useEffect(() => {
        console.log('Reservations in ReservationList:', reservations);
        setFilteredReservations(reservations);
    }, [reservations]);



    return (
        <div className="">
            <div className="flex justify-between items-center mb-4">

            </div>
            <div className='px-4'>
                <ReservationTable
                    reservations={filteredReservations}
                    visibleColumns={visibleColumns}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    toggleColumn={toggleColumn}
                />
            </div>

        </div>
    )
}