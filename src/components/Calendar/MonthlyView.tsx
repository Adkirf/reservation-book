"use client"

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useReservation } from '@/contexts/ReservationProvider';
import { Month, Months } from '@/lib/projectTypes';
import { useSwipeable } from 'react-swipeable';
import { userSetting } from '@/lib/settings';

export function MonthlyView() {
  const { reservations, updateEditingReservation, handleOpenDrawer, resetEditingReservation, editingReservation, getReservationsByMonth, setEditingReservation } = useReservation();
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [adjustingEnd, setAdjustingEnd] = useState<'start' | 'end' | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null)

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const year = currentDate.getFullYear()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDays([])
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDays([])
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => nextMonth(),
    onSwipedRight: () => prevMonth(),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true
  });


  const handleDayClick = (day: number, event: React.MouseEvent | React.TouchEvent) => {
    // For mouse events, prevent default behavior
    if (event.type === 'click') {
      event.preventDefault();
    }

    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const reservationOnDay = currentMonthReservations.find(reservation => {
      const startDate = new Date(reservation.dateStart);
      const endDate = new Date(reservation.dateEnd);
      return day >= startDate.getDate() && day <= endDate.getDate();
    });

    if (reservationOnDay) {
      setEditingReservation(reservationOnDay);
      handleOpenDrawer();
    } else {
      handleDayInteractionStart(day);
    }
  };

  const handleDayInteractionStart = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isWithinExistingReservation = currentMonthReservations.some(reservation => {
      const startDate = new Date(reservation.dateStart);
      const endDate = new Date(reservation.dateEnd);
      return selectedDate >= startDate && selectedDate <= endDate;
    });

    if (selectedDays.length > 0) {
      if (day === selectedDays[0]) {
        setAdjustingEnd('start');
        setIsSelecting(true);
        return;
      } else if (day === selectedDays[selectedDays.length - 1]) {
        setAdjustingEnd('end');
        setIsSelecting(true);
        return;
      }
    } else {

    }
    if (!isWithinExistingReservation) {
      setIsSelecting(true);
      setSelectedDays([day]);
      setAdjustingEnd(null);

      const startDate = new Date(selectedDate);
      startDate.setHours(userSetting.checkInHour, 0, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(userSetting.checkOutHour, 0, 0, 0);
      resetEditingReservation();
      updateEditingReservation({
        dateStart: startDate,
        dateEnd: endDate,
      });
    }
  }

  const handleDayInteractionMove = (day: number) => {
    if (isSelecting) {
      setSelectedDays(prevSelected => {
        if (prevSelected.length === 0) return [day];

        const firstSelected = prevSelected[0];
        const lastSelected = prevSelected[prevSelected.length - 1];

        let newSelection: number[];

        if (prevSelected.length === 1) {
          newSelection = range(Math.min(firstSelected, day), Math.max(firstSelected, day));
        } else if (adjustingEnd === 'start' && day <= lastSelected) {
          newSelection = range(day, lastSelected);
        } else if (adjustingEnd === 'end' && day >= firstSelected) {
          newSelection = range(firstSelected, day);
        } else if (!adjustingEnd) {
          newSelection = range(firstSelected, day);
        } else {
          // If trying to adjust beyond the fixed end, don't change the selection
          return prevSelected;
        }

        // Filter out days that are within existing reservations
        newSelection = newSelection.filter(d => !isWithinReservation(d));

        return newSelection;
      });
    }
  }

  const handleDayInteractionEnd = () => {
    setIsSelecting(false);
    setAdjustingEnd(null);
    if (selectedDays.length > 0) {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDays[0]);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDays[selectedDays.length - 1]);

      // Set the start date to the check-in hour
      startDate.setHours(userSetting.checkInHour, 0, 0, 0);

      // Set the end date to the check-out hour of the day after the last selected day
      endDate.setHours(userSetting.checkOutHour, 0, 0, 0);

      updateEditingReservation({
        dateStart: startDate,
        dateEnd: endDate,
      });
    }
  }

  const isFirstSelected = (day: number) => selectedDays[0] === day
  const isLastSelected = (day: number) => selectedDays[selectedDays.length - 1] === day

  // New function to check if a day has a reservation
  const currentMonth = Months[currentDate.getMonth()] as Month;
  const currentYear = currentDate.getFullYear();
  const currentMonthReservations = getReservationsByMonth(currentMonth, currentYear);


  const isReservationStart = (day: number) => {
    return currentMonthReservations.some(reservation => {
      const startDate = new Date(reservation.dateStart);
      return startDate.getDate() === day && startDate.getMonth() === currentDate.getMonth();
    });
  }

  const isReservationEnd = (day: number) => {
    return currentMonthReservations.some(reservation => {
      const endDate = new Date(reservation.dateEnd);
      return endDate.getDate() === day && endDate.getMonth() === currentDate.getMonth();
    });
  }

  const isWithinReservation = (day: number) => {
    return currentMonthReservations.some(reservation => {
      const startDate = new Date(reservation.dateStart);
      const endDate = new Date(reservation.dateEnd);
      const checkDate = new Date(currentYear, currentDate.getMonth(), day);
      return checkDate >= startDate && checkDate <= endDate;
    });
  }

  // Helper function to generate a range of numbers
  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  useEffect(() => {
    if (editingReservation?.dateStart && editingReservation?.dateEnd) {
      const start = new Date(editingReservation.dateStart);
      const end = new Date(editingReservation.dateEnd);
      if (start.getMonth() === currentDate.getMonth() && start.getFullYear() === currentDate.getFullYear()) {
        const newSelectedDays = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          newSelectedDays.push(d.getDate());
        }
        // Include the end date
        if (end.getMonth() === currentDate.getMonth() && end.getFullYear() === currentDate.getFullYear()) {
          newSelectedDays.push(end.getDate());
        }
        setSelectedDays(newSelectedDays);
      } else {
        setSelectedDays([]);
      }
    }
  }, [editingReservation, currentDate]);

  useEffect(() => {
    const handleMouseUp = () => setIsSelecting(false)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [])

  return (
    <div className="h-full w-full md:max-w-[400px] p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth} aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {monthName} {year}
        </h2>
        <Button variant="ghost" size="icon" onClick={nextMonth} aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 text-center" ref={calendarRef}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`aspect-square flex items-center justify-center mb-1 text-sm
            
              ${isReservationStart(day) && isReservationEnd(day) ? 'border-2 border-primary rounded-full' :
                isReservationStart(day) ? 'border-2 border-r-0 border-primary rounded-l-full' :
                  isReservationEnd(day) ? 'border-2 border-l-0 border-primary rounded-r-full' : ''}
              ${isWithinReservation(day) && !isReservationStart(day) && !isReservationEnd(day) ? 'border-t-2 border-b-2 border-primary' : ''}
              ${selectedDays.includes(day) ?
                (isFirstSelected(day) || isLastSelected(day) ?
                  `bg-primary ${isFirstSelected(day) ? 'rounded-l-full' : ''} ${isLastSelected(day) ? 'rounded-r-full' : ''} text-primary-foreground` :
                  'bg-gray-300 rounded text-gray-800'
                ) :
                'hover:bg-muted'
              }
            `}
            onClick={(e) => handleDayClick(day, e)}
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent text selection
              handleDayInteractionStart(day);
            }}
            onMouseEnter={() => handleDayInteractionMove(day)}
            onMouseUp={handleDayInteractionEnd}
            onTouchStart={(e) => {
              handleDayClick(day, e);
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0]
              const element = document.elementFromPoint(touch.clientX, touch.clientY)
              const dayElement = element?.closest('[data-day]')
              if (dayElement) {
                const touchedDay = parseInt(dayElement.getAttribute('data-day') || '0', 10)
                handleDayInteractionMove(touchedDay)
              }
            }}
            onTouchEnd={handleDayInteractionEnd}
            data-day={day}
          >
            <span className="w-full h-full flex items-center justify-center">{day}</span>
          </div>
        ))}
      </div>
      <div
        {...handlers}
        className="flex-grow"
      >
      </div>
    </div>
  )
}