"use client"

import { useState, useEffect } from 'react'
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
import { dbItem } from '@/lib/projectTypes'
import ReservationTable from './ReservationTable'

interface ReservationListProps {
    items: dbItem[];
    selectedTab: 'All' | 'Reservations' | 'Tasks';
    setSelectedTab: (tab: 'All' | 'Reservations' | 'Tasks') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    visibleColumns: string[];
    setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ReservationList({
    items,
    selectedTab,
    setSelectedTab,
    searchQuery,
    setSearchQuery,
    visibleColumns,
    setVisibleColumns
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

    const toggleColumnVisibility = (column: string) => {
        setVisibleColumns((prev) => {
            if (prev.includes(column)) {
                return prev.filter((col) => col !== column);
            } else {
                return [...prev, column];
            }
        });
    };

    return (
        <div className="">
            <div className="flex justify-between items-center mb-4">
                <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Columns</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {['name', 'dateStart', 'numberOfPeople', 'assignedTo'].map((column) => (
                            <DropdownMenuCheckboxItem
                                key={column}
                                checked={visibleColumns.includes(column)}
                                onCheckedChange={() => toggleColumnVisibility(column)}
                            >
                                {column}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Tabs value={selectedTab} onValueChange={handleTabChange}>
                <TabsList>
                    <TabsTrigger value="All">All</TabsTrigger>
                    <TabsTrigger value="Reservations">Reservations</TabsTrigger>
                    <TabsTrigger value="Tasks">Tasks</TabsTrigger>
                </TabsList>
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
                        items={filteredItems.filter(item => 'assignedTo' in item)}
                        visibleColumns={visibleColumns}
                        title="Tasks"
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}