"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    currentDateRange?: [Date, Date]
    onDateRangeChange?: (dateRange: DateRange | undefined) => void
}

export default function DateRangePicker({
    currentDateRange,
    onDateRangeChange,
}: DateRangePickerProps) {
    const [date, setDate] = useState<DateRange | undefined>(
        currentDateRange && isValidDateRange(currentDateRange)
            ? { from: currentDateRange[0], to: currentDateRange[1] }
            : undefined
    )
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        console.log("currentDateRange", currentDateRange)
        if (currentDateRange && isValidDateRange(currentDateRange)) {
            setDate({ from: currentDateRange[0], to: currentDateRange[1] })
        }
    }, [currentDateRange])

    const handleDateSelect = (newDate: DateRange | undefined) => {
        setDate(newDate)
    }

    const formatDate = (date: Date | undefined) => {
        if (!date || isNaN(date.getTime())) {
            return "Pick a date"
        }
        return format(date, "LLL dd, y")
    }
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
    }

    return (
        <div className="grid gap-2">
            <Popover open={isOpen} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        onClick={() => setIsOpen(true)}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {formatDate(date.from)} - {formatDate(date.to)}
                                </>
                            ) : (
                                formatDate(date.from)
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from || new Date()}
                        selected={date}
                        onSelect={handleDateSelect}
                        numberOfMonths={1}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

function isValidDateRange(dateRange: [Date, Date]): boolean {
    return dateRange.every(date => date instanceof Date && !isNaN(date.getTime()))
}