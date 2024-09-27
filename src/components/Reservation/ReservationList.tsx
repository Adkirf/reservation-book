"use client"

import { useState, useEffect } from 'react'
import { Filter, Search } from 'lucide-react'
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
import { dbItem } from '@/lib/projectTypes'
import ReservationTable from './ReservationTable'
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

interface ReservationListProps {
    items: dbItem[];
    selectedTab: 'All' | 'Reservations' | 'Tasks';
    setSelectedTab: (tab: 'All' | 'Reservations' | 'Tasks') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    visibleColumns: string[];
    allColumns: string[];
    defaultColumns: string[];
    toggleColumn: (column: string) => void;
}

export default function ReservationList({
    items,
    selectedTab,
    setSelectedTab,
    searchQuery,
    setSearchQuery,
    visibleColumns,
    allColumns,
    defaultColumns,
    toggleColumn
}: ReservationListProps) {
    const [filteredItems, setFilteredItems] = useState<dbItem[]>(items);

    useEffect(() => {
        console.log('Items in ReservationList:', items);
        setFilteredItems(items);
    }, [items]);

    const handleTabChange = (value: string) => {
        setSelectedTab(value as 'All' | 'Reservations' | 'Tasks');
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // Function to capitalize the first letter of a string
    const capitalizeFirstLetter = (string: string): string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className="">
            <div className="mb-4">
                <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="max-w-sm"
                />

            </div>
            <Tabs value={selectedTab} onValueChange={handleTabChange}>
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="All">All</TabsTrigger>
                        <TabsTrigger value="Reservations">Reservations</TabsTrigger>
                        <TabsTrigger value="Tasks">Tasks</TabsTrigger>
                    </TabsList>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline"><Filter className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
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
                                    {column === 'numberOfPeople' ? 'Guests' : capitalizeFirstLetter(column)}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <TabsContent value="All">
                    <ReservationTable
                        items={filteredItems}
                        visibleColumns={visibleColumns}
                        title="All Items"
                    />
                </TabsContent>
                <TabsContent value="Reservations">
                    <ReservationTable
                        items={filteredItems.filter(item => 'numberOfPeople' in item)}
                        visibleColumns={visibleColumns}
                        title="Reservations"
                    />
                </TabsContent>
                <TabsContent value="Tasks">
                    <ReservationTable
                        items={filteredItems.filter(item => !('numberOfPeople' in item))}
                        visibleColumns={visibleColumns}
                        title="Tasks"
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}