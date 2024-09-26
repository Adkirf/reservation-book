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

// Define the props interface for the ReservationTable component
interface ReservationTableProps {
    items: dbItem[]
    visibleColumns: string[]
    title: string
}

/**
 * ReservationTable: A component that displays a table of dbItems with dynamic column visibility.
 * It allows for responsive design for different screen sizes.
 */
export default function ReservationTable({ items, visibleColumns, title }: ReservationTableProps) {
    console.log('Items in ReservationTable:', items);
    console.log('Visible columns:', visibleColumns);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {visibleColumns.map((column) => (
                                <TableHead key={column}>{column}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => (
                            <TableRow key={index}>
                                {visibleColumns.map((column) => (
                                    <TableCell key={column}>
                                        {(item as any)[column]?.toString() || ''}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
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