import React from 'react';
import { cn } from '@/lib/utils';
import { useReservation } from '@/contexts/ReservationProvider';

interface DayCellProps {
    day: number;
    isSelected: boolean;
    isFirstSelected: boolean;
    isLastSelected: boolean;
    isReservationStart: boolean;
    isReservationEnd: boolean;
    isWithinReservation: boolean;
    isEndingMonthOfReservation: boolean;
    isStartingMonthOfReservation: boolean;
    onDayClick: (day: number, event: React.MouseEvent | React.TouchEvent) => void;
    onDayInteractionStart: (day: number) => void;
    onDayInteractionMove: (day: number) => void;
    onDayInteractionEnd: () => void;
}

export function DayCell({
    day,
    isSelected,
    isFirstSelected,
    isLastSelected,
    isReservationStart,
    isReservationEnd,
    isWithinReservation,
    isEndingMonthOfReservation,
    isStartingMonthOfReservation,
    onDayClick,
    onDayInteractionStart,
    onDayInteractionMove,
    onDayInteractionEnd,
}: DayCellProps) {


    const baseClasses = "aspect-square flex items-center justify-center mb-1 text-sm";

    const reservationClasses = cn({
        'border-2 border-primary rounded-full': isReservationStart && isReservationEnd,
        'border-2 border-r-0 border-primary rounded-l-full': isReservationStart && !isReservationEnd,
        'border-2 border-l-0 border-primary rounded-r-full': isReservationEnd && !isReservationStart,
        'border-t-2 border-b-2 border-primary': (isWithinReservation && !isReservationStart && !isReservationEnd)
    });

    const selectionClasses = cn({
        'bg-primary text-primary-foreground': isSelected && ((isFirstSelected && !isEndingMonthOfReservation) || (isFirstSelected && isLastSelected && (isEndingMonthOfReservation || isStartingMonthOfReservation)) || (isLastSelected && !isStartingMonthOfReservation)),
        'rounded-l-full': isSelected && isFirstSelected && !isEndingMonthOfReservation,
        'rounded-r-full': isSelected && isLastSelected && !isStartingMonthOfReservation,
        'bg-gray-300 rounded text-gray-800': isSelected &&
            !((isFirstSelected && !isEndingMonthOfReservation) || (isLastSelected && !isStartingMonthOfReservation)),
        'hover:bg-muted': !isSelected,
    });



    return (
        <div
            className={cn(baseClasses, reservationClasses, selectionClasses)}
            onClick={(e) => onDayClick(day, e)}
            onMouseDown={(e) => {
                e.preventDefault();
                onDayInteractionStart(day);
            }}
            onMouseEnter={() => onDayInteractionMove(day)}
            onMouseUp={onDayInteractionEnd}
            onTouchStart={(e) => onDayClick(day, e)}
            onTouchMove={(e) => {
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                const dayElement = element?.closest('[data-day]');
                if (dayElement) {
                    const touchedDay = parseInt(dayElement.getAttribute('data-day') || '0', 10);
                    onDayInteractionMove(touchedDay);
                }
            }}
            onTouchEnd={onDayInteractionEnd}
            data-day={day}
        >
            <span className="w-full h-full flex items-center justify-center">{day}</span>
        </div>
    );
}