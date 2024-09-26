"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs"
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

export default function ReservationList({ reservations }: { reservations: Reservation[] }) {
    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        date: true,
        numberOfPeople: false,
    })

    const toggleColumn = (column: keyof typeof visibleColumns) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))
    }


    const filteredReservations = reservations.filter(reservation =>
        reservation
    );

    return (
        <div className="">
            <Tabs defaultValue="week">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.entries(visibleColumns).map(([column, isVisible]) => (
                                <DropdownMenuCheckboxItem
                                    key={column}
                                    checked={isVisible}
                                    onCheckedChange={() => toggleColumn(column as keyof typeof visibleColumns)}
                                >
                                    {column.charAt(0).toUpperCase() + column.slice(1)}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <TabsContent value="week">
                    <ReservationTable
                        reservations={filteredReservations}
                        visibleColumns={visibleColumns}
                        title="This Week's Reservations"
                    />
                </TabsContent>
                <TabsContent value="month">
                    <ReservationTable
                        reservations={filteredReservations}
                        visibleColumns={visibleColumns}
                        title="This Month's Reservations"
                    />
                </TabsContent>
                <TabsContent value="year">
                    <ReservationTable
                        reservations={filteredReservations}
                        visibleColumns={visibleColumns}
                        title="This Year's Reservations"
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}