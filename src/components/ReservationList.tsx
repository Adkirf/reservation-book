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
import { Badge } from "@/components/ui/badge"
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

export default function ReservationList(reservations: Reservation[]) {
    const [searchTerm, setSearchTerm] = useState('')
    const [visibleColumns, setVisibleColumns] = useState({
        customer: true,
        amount: true,
        comment: false,
    })

    const toggleColumn = (column: keyof typeof visibleColumns) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-8 w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
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
            <Tabs defaultValue="week">
                <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
                <TabsContent value="week">
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders</CardTitle>
                            <CardDescription>
                                Recent orders from your store.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {visibleColumns.customer && <TableHead>Customer</TableHead>}
                                        {visibleColumns.comment && <TableHead className="hidden sm:table-cell">Comment</TableHead>}
                                        {visibleColumns.amount && <TableHead className="hidden md:table-cell">Amount</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        {visibleColumns.customer && (
                                            <TableCell>
                                                <div className="font-medium">Liam Johnson</div>
                                                <div className="hidden text-sm text-muted-foreground md:inline">
                                                    liam@example.com
                                                </div>
                                            </TableCell>
                                        )}


                                        {visibleColumns.amount && (
                                            <TableCell className="hidden md:table-cell">
                                                2023-06-23
                                            </TableCell>
                                        )}
                                        {visibleColumns.comment && (
                                            <TableCell className="text-right">$250.00</TableCell>
                                        )}
                                    </TableRow>
                                    <TableRow>
                                        {visibleColumns.customer && (
                                            <TableCell>
                                                <div className="font-medium">Olivia Smith</div>
                                                <div className="hidden text-sm text-muted-foreground md:inline">
                                                    olivia@example.com
                                                </div>
                                            </TableCell>
                                        )}


                                        {visibleColumns.amount && (
                                            <TableCell className="hidden md:table-cell">
                                                2023-06-24
                                            </TableCell>
                                        )}
                                        {visibleColumns.comment && (
                                            <TableCell className="text-right">$150.00</TableCell>
                                        )}
                                    </TableRow>
                                    <TableRow>
                                        {visibleColumns.customer && (
                                            <TableCell>
                                                <div className="font-medium">Noah Williams</div>
                                                <div className="hidden text-sm text-muted-foreground md:inline">
                                                    noah@example.com
                                                </div>
                                            </TableCell>
                                        )}

                                        {visibleColumns.amount && (
                                            <TableCell className="text-right">$350.00</TableCell>
                                        )}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>1-3</strong> of <strong>32</strong>{" "}
                                products
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}