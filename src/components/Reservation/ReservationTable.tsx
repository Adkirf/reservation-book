import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
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
import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { useState } from "react"

// Define the props interface for the ReservationTable component
interface ReservationTableProps {
    reservations: Reservation[]
    visibleColumns: {
        name: boolean
        date: boolean
        numberOfPeople: boolean
    }
    title: string
}

/**
 * ReservationTable: A component that displays a table of reservations with search functionality.
 * It allows for dynamic column visibility and responsive design for different screen sizes.
 */
export default function ReservationTable({ reservations, visibleColumns, title }: ReservationTableProps) {
    // State to manage the search term entered by the user
    const [searchTerm, setSearchTerm] = useState('')

    // TODO: Implement search functionality
    // This should filter the reservations based on the searchTerm

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {/* Search input with icon */}
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, date, or number"
                        className="pl-8 w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {/* Conditionally render table headers based on visibleColumns prop */}
                            {visibleColumns.name && <TableHead>Name</TableHead>}
                            {visibleColumns.date && <TableHead className="hidden sm:table-cell">Date</TableHead>}
                            {visibleColumns.numberOfPeople && <TableHead className="hidden md:table-cell">Number of People</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Map through reservations to create table rows */}
                        {reservations.map((reservation, index) => (
                            <TableRow key={index}>
                                {/* Conditionally render table cells based on visibleColumns prop */}
                                {visibleColumns.name && (
                                    <TableCell>
                                        <div className="font-medium">{reservation.name}</div>
                                    </TableCell>
                                )}
                                {visibleColumns.date && (
                                    <TableCell className="hidden sm:table-cell">{"startDate"}</TableCell>
                                )}
                                {visibleColumns.numberOfPeople && (
                                    <TableCell className="hidden md:table-cell">{reservation.numberOfPeople}</TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                {/* Display the total number of reservations */}
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{reservations.length}</strong> reservations
                </div>
            </CardFooter>
        </Card>
    )
}