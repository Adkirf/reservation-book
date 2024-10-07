"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthProvider'

interface DayRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    currentDateRange: [Date, Date]
    onClose: () => void
}

export default function DayRangePicker({
    currentDateRange,
    onClose,
}: DayRangePickerProps) {
    const { t } = useAuth();

    const formatDate = (date: Date | undefined) => {
        if (!date || isNaN(date.getTime())) {
            return t('formInputs.pickDate')
        }
        return format(date, "LLL dd, y")
    }

    const handleButtonClick = React.useCallback(() => {
        onClose()
    }, [onClose])

    return (
        <div className="grid gap-2">
            <Button
                id="date"
                variant={"outline"}
                className={cn(
                    "w-full justify-start text-left font-normal",
                )}
                onClick={handleButtonClick}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {currentDateRange[0] && currentDateRange[1] ? (
                    <>
                        {formatDate(currentDateRange[0])} - {formatDate(currentDateRange[1])}
                    </>
                ) : (
                    <span>{t('formInputs.pickDateRange')}</span>
                )}
            </Button>
        </div>
    )
}

function isValidDateRange(dateRange: [Date, Date]): boolean {
    return dateRange.every(date => date instanceof Date && !isNaN(date.getTime()))
}