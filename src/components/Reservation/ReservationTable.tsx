import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table"
import { Reservation } from '@/lib/projectTypes'
import { format } from 'date-fns';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { useReservationFilters } from '@/hooks/useReservationFilter';
import { useReservation } from '@/contexts/ReservationProvider';
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

// Update the props interface for the ReservationTable component
interface ReservationTableProps {
    reservations: Reservation[]
    visibleColumns: string[]
    searchQuery: string
    setSearchQuery: (query: string) => void
    toggleColumn: (column: string) => void
}

// Update the formatDateRange function to handle the new column name
function formatDateRange(reservation: Reservation): string {
    if (!reservation.dateStart || !reservation.dateEnd) return '';
    return `${format(reservation.dateStart, 'dd')} - ${format(reservation.dateEnd, 'dd.MM')}`;
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * ReservationTable: A component that displays a table of Reservations with dynamic column visibility.
 * It allows for responsive design for different screen sizes.
 */
export default function ReservationTable({ reservations, visibleColumns, searchQuery, setSearchQuery, toggleColumn }: ReservationTableProps) {
    const { sortConfig, requestSort, formatDateRange } = useReservationFilters(reservations);
    const { setEditingReservation, handleOpenDrawer } = useReservation();

    const formatCellValue = (value: any, column: string): string => {
        if (value === null || value === undefined) return '';

        switch (column) {
            case 'dateStart':
            case 'dateEnd':
                return value instanceof Date ? format(value, 'yyyy-MM-dd HH:mm') : String(value);
            case 'contact':
                return Array.isArray(value) ? value.join(', ') : String(value);
            default:
                return String(value);
        }
    };

    const handleRowClick = (reservation: Reservation) => {
        setEditingReservation(reservation);
        handleOpenDrawer();
    };

    return (
        <Card className="h-full flex flex-col">
            <CardContent className="flex-grow overflow-auto relative">
                <Table>
                    <TableHeader className="sticky top-0 z-10">
                        <TableRow>
                            {visibleColumns.map((column) => (
                                <TableHead
                                    key={column}
                                    onClick={() => requestSort(column)}
                                    className="cursor-pointer whitespace-nowrap bg-background"
                                >
                                    {column === 'numberOfPeople'
                                        ? 'Guests'
                                        : capitalizeFirstLetter(column)}
                                    {sortConfig.key === column && (
                                        sortConfig.direction === 'asc'
                                            ? <ChevronUp className="inline ml-1" />
                                            : <ChevronDown className="inline ml-1" />
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reservations.map((reservation) => (
                            <TableRow
                                key={reservation.id}
                                onClick={() => handleRowClick(reservation)}
                                className="cursor-pointer hover:bg-muted/50"
                            >
                                {visibleColumns.map((column) => (
                                    <TableCell
                                        key={column}
                                        className="whitespace-nowrap"
                                    >
                                        {formatCellValue(reservation[column as keyof Reservation], column)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={visibleColumns.length} className="h-4" />
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{reservations.length}</strong> reservations
                </div>
            </CardFooter>
        </Card>
    )
}
