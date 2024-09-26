import React from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useReservation } from "@/contexts/ReservationProvider";
import { useReservationFilters } from "@/hooks/useReservationFilter";

export default function ColumnVisibilityDropdown() {
    const { items } = useReservation();
    const { visibleColumns, setVisibleColumns, updateFilters } = useReservationFilters(items);

    // Function to toggle the visibility of a specific column
    const toggleColumn = (column: string) => {
        setVisibleColumns(prev =>
            prev.includes(column)
                ? prev.filter(col => col !== column)
                : [...prev, column]
        );
        updateFilters();
    };

    // Get all possible columns from the first item
    const allColumns = items.length > 0 ? Object.keys(items[0]) : [];

    return (
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
                {allColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                        key={column}
                        checked={visibleColumns.includes(column)}
                        onCheckedChange={() => toggleColumn(column)}
                    >
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}