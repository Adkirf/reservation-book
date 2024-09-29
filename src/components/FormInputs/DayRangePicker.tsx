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
import { useEffect, useState, useCallback, useRef } from "react"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    currentDateRange: [Date, Date]
    onDateRangeChange: (dateRange: DateRange) => void
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
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [popoverWidth, setPopoverWidth] = useState<number>(0)


    useEffect(() => {
        const updateWidth = () => {
            if (triggerRef.current) {
                const newWidth = Math.max(triggerRef.current.offsetWidth, 100) // Minimum width of 320px
                setPopoverWidth(newWidth)
            }
        }

        updateWidth()
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [])

    useEffect(() => {
        console.log("currentDateRange", currentDateRange)
        if (currentDateRange && isValidDateRange(currentDateRange)) {
            setDate({ from: currentDateRange[0], to: currentDateRange[1] })
        }
    }, [currentDateRange])

    const handleDateSelect = (newDate: DateRange | undefined) => {
        if (newDate) {
            setDate(newDate)
            onDateRangeChange(newDate)
        }
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

    const handleButtonClick = useCallback(() => {
        setIsOpen(true)
    }, [])

    return (
        <div className="grid gap-2">
            <Popover open={isOpen} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        ref={triggerRef}
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        onClick={handleButtonClick}
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
                <PopoverContent style={{ minHeight: '100px', width: `${popoverWidth}px`, maxWidth: '100vw' }}
                    className="p-2" align="start">
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
        </div >
    )
}

function isValidDateRange(dateRange: [Date, Date]): boolean {
    return dateRange.every(date => date instanceof Date && !isNaN(date.getTime()))
}