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
import { dbItem } from '@/lib/projectTypes'
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useReservationFilters } from '@/hooks/useReservationFilter';


// Update the props interface for the ReservationTable component
interface ReservationTableProps {
    items: dbItem[]
    visibleColumns: string[]
    title: string
}

// Update the formatDateRange function to handle the new column name
function formatDateRange(item: dbItem): string {
    if (!item.dateStart || !item.dateEnd) return '';
    return `${format(item.dateStart, 'dd')} - ${format(item.dateEnd, 'dd.MM')}`;
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * ReservationTable: A component that displays a table of dbItems with dynamic column visibility.
 * It allows for responsive design for different screen sizes.
 */
export default function ReservationTable({ items, visibleColumns, title }: ReservationTableProps) {
    const { sortConfig, requestSort } = useReservationFilters(items);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto"> {/* Add overflow-x-auto here */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            {visibleColumns.map((column) => (
                                <TableHead
                                    key={column}
                                    onClick={() => requestSort(column)}
                                    className="cursor-pointer whitespace-nowrap"
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
                        {items.map((item, index) => (
                            <TableRow key={index}>
                                {visibleColumns.map((column) => (
                                    <TableCell key={column} className="whitespace-nowrap"> {/* Add whitespace-nowrap here */}
                                        {column === 'date'
                                            ? formatDateRange(item)
                                            : (item as any)[column]?.toString() || ''}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        <span className="block h-4" />
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{items.length}</strong> items
                </div>
            </CardFooter>
        </Card>
    )
}
