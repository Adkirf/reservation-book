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

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    currentDateRange?: [Date, Date]
    onDateRangeChange?: (dateRange: DateRange | undefined) => void
}

export default function DateRangePicker({
    className,
    currentDateRange,
    onDateRangeChange,
}: DateRangePickerProps) {
    const [date, setDate] = React.useState<DateRange | undefined>(
        currentDateRange && isValidDateRange(currentDateRange)
            ? { from: currentDateRange[0], to: currentDateRange[1] }
            : undefined
    )

    React.useEffect(() => {
        if (currentDateRange && isValidDateRange(currentDateRange)) {
            setDate({ from: currentDateRange[0], to: currentDateRange[1] })
        }
    }, [currentDateRange])

    const handleDateSelect = (newDate: DateRange | undefined) => {
        setDate(newDate)
        onDateRangeChange?.(newDate)
    }

    const formatDate = (date: Date | undefined) => {
        if (!date || isNaN(date.getTime())) {
            return "Pick a date"
        }
        return format(date, "LLL dd, y")
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
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
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateSelect}
                        numberOfMonths={1}
                        disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                        }
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

function isValidDateRange(dateRange: [Date, Date]): boolean {
    return dateRange.every(date => date instanceof Date && !isNaN(date.getTime()))
}