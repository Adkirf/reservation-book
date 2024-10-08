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
import { allColumns, Reservation } from '@/lib/projectTypes'
import ReservationTable from './ReservationTable'
import { useAuth } from '@/contexts/AuthProvider';

interface ReservationListProps {
    reservations: Reservation[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    visibleColumns: string[];
    toggleColumn: (column: string) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    setItemsPerPage: (count: number) => void;
}

export default function ReservationList({
    reservations,
    searchQuery,
    setSearchQuery,
    visibleColumns,
    toggleColumn,
    currentPage,
    setCurrentPage,
    totalPages,
    setItemsPerPage
}: ReservationListProps) {
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>(reservations);
    const { t } = useAuth();

    useEffect(() => {
        console.log('Reservations in ReservationList:', reservations);
        setFilteredReservations(reservations);
    }, [reservations]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const translateColumn = (column: string): string => {
        const translationKey = `columns.${column}`;
        return t(translationKey);
    };

    return (
        <div className="flex flex-col h-full">
            <div className='flex flex-row gap-2 mb-4'>
                <Input
                    type="text"
                    placeholder={t('reservations.searchPlaceholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline"><Filter className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>{t('reservations.toggleColumns')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {allColumns.map((column) => (
                            <DropdownMenuCheckboxItem
                                key={column}
                                checked={visibleColumns.includes(column)}
                                onCheckedChange={() => toggleColumn(column)}
                                disabled={visibleColumns.length === 1 && visibleColumns.includes(column)}
                                onSelect={(event) => {
                                    event.preventDefault();
                                }}
                            >
                                {translateColumn(column)}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex-grow overflow-hidden">
                <ReservationTable
                    reservations={filteredReservations}
                    visibleColumns={visibleColumns}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    toggleColumn={toggleColumn}
                    translateColumn={translateColumn}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    totalReservations={reservations.length}
                    setItemsPerPage={setItemsPerPage}
                />
            </div>
        </div>
    )
}