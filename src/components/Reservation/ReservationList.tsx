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

/**
 * ReservationList: A component that displays a list of reservations with filtering and column visibility options.
 * It uses tabs to organize reservations by time period (week, month, year) and allows toggling of column visibility.
 */
export default function ReservationList({ reservations }: { reservations: Reservation[] }) {
    // State to manage which columns are visible in the reservation table
    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        date: true,
        numberOfPeople: false,
    })

    // Function to toggle the visibility of a specific column
    const toggleColumn = (column: keyof typeof visibleColumns) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))
    }

    // TODO: Implement actual filtering logic
    // Currently, this doesn't filter anything and returns all reservations
    const filteredReservations = reservations.filter(reservation =>
        reservation
    );

    return (
        <div className="">
            <Tabs defaultValue="week">
                <div className="flex justify-between items-center">
                    {/* Tab navigation for different time periods */}
                    <TabsList>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                    {/* Dropdown menu for toggling column visibility */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* Generate checkbox items for each column */}
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
                {/* Content for each tab, displaying reservations for different time periods */}
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