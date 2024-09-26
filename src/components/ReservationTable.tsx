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
import { Input } from "./ui/input"
import { useState } from "react"

interface ReservationTableProps {
    reservations: Reservation[]
    visibleColumns: {
        name: boolean
        date: boolean
        numberOfPeople: boolean
    }
    title: string
}

export default function ReservationTable({ reservations, visibleColumns, title }: ReservationTableProps) {
    const [searchTerm, setSearchTerm] = useState('')




    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
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
                            {visibleColumns.name && <TableHead>Name</TableHead>}
                            {visibleColumns.date && <TableHead className="hidden sm:table-cell">Date</TableHead>}
                            {visibleColumns.numberOfPeople && <TableHead className="hidden md:table-cell">Number of People</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reservations.map((reservation, index) => (
                            <TableRow key={index}>
                                {visibleColumns.name && (
                                    <TableCell>
                                        <div className="font-medium">{reservation.name}</div>
                                    </TableCell>
                                )}
                                {visibleColumns.date && (
                                    <TableCell className="hidden sm:table-cell">{reservation.date.toLocaleDateString()}</TableCell>
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
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{reservations.length}</strong> reservations
                </div>
            </CardFooter>
        </Card>
    )
}