import { useRef, useEffect, useState } from 'react';
import {
    Card,
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
import { useReservation } from '@/contexts/ReservationProvider';
import { format } from 'date-fns';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface ReservationTableProps {
    reservations: Reservation[]
    visibleColumns: string[]
    searchQuery: string
    setSearchQuery: (query: string) => void
    toggleColumn: (column: string) => void
    translateColumn: (column: string) => string;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    totalReservations: number;
    setItemsPerPage: (count: number) => void;
}

function useOptimalRowCount(containerRef: React.RefObject<HTMLElement>, rowRef: React.RefObject<HTMLElement>) {
    const [optimalRowCount, setOptimalRowCount] = useState(10);

    useEffect(() => {
        function calculateOptimalRowCount() {
            if (containerRef.current && rowRef.current) {
                const containerHeight = containerRef.current.clientHeight;
                const rowHeight = rowRef.current.clientHeight;
                const headerHeight = 40; // Approximate height of the table header
                const footerHeight = 56; // Approximate height of the pagination footer
                const availableHeight = containerHeight - headerHeight - footerHeight;
                const calculatedRowCount = Math.floor(availableHeight / rowHeight);
                setOptimalRowCount(Math.max(10, calculatedRowCount)); // Ensure at least 10 rows
            }
        }

        const resizeObserver = new ResizeObserver(calculateOptimalRowCount);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [containerRef, rowRef]);

    return optimalRowCount;
}

export default function ReservationTable({
    reservations,
    visibleColumns,
    searchQuery,
    setSearchQuery,
    toggleColumn,
    translateColumn,
    currentPage,
    setCurrentPage,
    totalPages,
    totalReservations,
    setItemsPerPage
}: ReservationTableProps) {
    const { updateEditingReservation, handleOpenDrawer } = useReservation();
    const containerRef = useRef<HTMLDivElement>(null);
    const rowRef = useRef<HTMLTableRowElement>(null);
    const optimalRowCount = useOptimalRowCount(containerRef, rowRef);

    useEffect(() => {
        setItemsPerPage(optimalRowCount);
    }, [optimalRowCount, setItemsPerPage]);

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
        updateEditingReservation(reservation);
        handleOpenDrawer();
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => setCurrentPage(i)}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        onClick={() => setCurrentPage(1)}
                        isActive={currentPage === 1}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 3) {
                items.push(<PaginationEllipsis key="ellipsis-start" />);
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => setCurrentPage(i)}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (currentPage < totalPages - 2) {
                items.push(<PaginationEllipsis key="ellipsis-end" />);
            }

            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        onClick={() => setCurrentPage(totalPages)}
                        isActive={currentPage === totalPages}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <Card className="flex flex-col h-[calc(100vh-100px)]" ref={containerRef}>
            <CardContent className="flex-grow overflow-auto relative">
                <Table>
                    <TableHeader className="sticky top-0 z-10">
                        <TableRow>
                            {visibleColumns.map((column) => (
                                <TableHead
                                    key={column}
                                    className="whitespace-nowrap bg-background text-center"
                                >
                                    {translateColumn(column)}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reservations.map((reservation, index) => (
                            <TableRow
                                key={reservation.id}
                                onClick={() => handleRowClick(reservation)}
                                className="cursor-pointer hover:bg-muted/50"
                                ref={index === 0 ? rowRef : null}
                            >
                                {visibleColumns.map((column) => (
                                    <TableCell
                                        key={column}
                                        className="whitespace-nowrap text-center"
                                    >
                                        {formatCellValue(reservation[column as keyof Reservation], column)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex justify-between items-center">

                <Pagination>
                    <PaginationContent>
                        {renderPaginationItems()}
                    </PaginationContent>
                </Pagination>
            </CardFooter>
        </Card>
    )
}
