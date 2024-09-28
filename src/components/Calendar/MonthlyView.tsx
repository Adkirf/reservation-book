"use client"

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useReservation } from '@/contexts/ReservationProvider';
import { Month, Months } from '@/lib/projectTypes';

export function MobileCalendar() {
  const { reservations, updateEditingReservation, handleOpenDrawer, editingReservation, getReservationsByMonth } = useReservation();
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [isSelecting, setIsSelecting] = useState(false)
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
  const handleDayInteractionStart = (day: number) => {
    setIsSelecting(true);
    setSelectedDays([day]);
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    updateEditingReservation({
      dateStart: selectedDate,
      dateEnd: selectedDate,
    });
  }

  const handleDayInteractionMove = (day: number) => {
    if (isSelecting) {
      setSelectedDays(prevSelected => {
        const lastSelected = prevSelected[prevSelected.length - 1]
        if (lastSelected === day) return prevSelected

        const newSelection = [...prevSelected]
        const step = Math.sign(day - lastSelected)
        for (let i = lastSelected + step; i !== day + step; i += step) {
          if (!newSelection.includes(i)) newSelection.push(i)
        }
        const sortedSelection = newSelection.sort((a, b) => a - b)

        // Create Date objects for the selected range
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), sortedSelection[0]);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), sortedSelection[sortedSelection.length - 1]);
        console.log("startDate", startDate);
        console.log("endDate", endDate);
        // Update the reservation context
        updateEditingReservation({
          dateStart: startDate,
          dateEnd: endDate,
        });

        return sortedSelection
      })
    }
  }

  const handleDayInteractionEnd = () => {
    setIsSelecting(false);
    if (selectedDays.length > 0) {
      console.log("Selected days:", selectedDays);
      handleOpenDrawer(); // Open the drawer when selection ends
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

  // Remove the useEffect that was calling refreshReservations

  useEffect(() => {
    // Update selected days when editingReservation changes
    if (editingReservation?.dateStart && editingReservation?.dateEnd) {
      const start = new Date(editingReservation.dateStart);
      const end = new Date(editingReservation.dateEnd);
      if (start.getMonth() === currentDate.getMonth() && start.getFullYear() === currentDate.getFullYear()) {
        const newSelectedDays = [];
        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          newSelectedDays.push(d.getDate());
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
    <div className="max-w-sm mx-auto p-4">
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
      <div className="grid grid-cols-7 gap-1 text-center" ref={calendarRef}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-10 sm:h-12"></div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`h-10 sm:h-12 flex items-center justify-center text-sm
              ${isWithinReservation(day) ? '-mx-[1px]' : ''}
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
            onMouseDown={() => handleDayInteractionStart(day)}
            onMouseEnter={() => handleDayInteractionMove(day)}
            onMouseUp={handleDayInteractionEnd}
            onTouchStart={() => handleDayInteractionStart(day)}
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
            <span className="w-8 h-8 flex items-center justify-center">{day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}