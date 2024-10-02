"use client"

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useReservation } from '@/contexts/ReservationProvider';
import { EditingReservation, Month, Months, Reservation } from '@/lib/projectTypes';
import { useSwipeable } from 'react-swipeable';
import { userSetting } from '@/lib/settings';
import { DayCell } from '@/components/Calendar/DayCell'; // New import

export function MonthlyView() {
  const { currentDate, isEditing, editingReservation, setCurrentDate, setIsEditing, updateEditingReservation, handleOpenDrawer, resetEditingReservation, setIntersectingArrivalHour, setIntersectingDepartureHour, getReservationsByMonth } = useReservation();
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [adjustingEnd, setAdjustingEnd] = useState<'start' | 'end'>('end');
  const [isEndingMonthOfReservation, setIsEndingMonthOfReservation] = useState(false)
  const [isStartingMonthOfReservation, setIsStartingMonthOfReservation] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const year = currentDate.getFullYear()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)



  const nextMonth = async () => {
    const firstDayNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    if (selectedDays.includes(daysInMonth)) {
      await setSelectedDays([1])
      await setIsEndingMonthOfReservation(true)
      await setIsStartingMonthOfReservation(false)
    }
    setCurrentDate(firstDayNextMonth)
  }

  const prevMonth = async () => {
    const lastDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
    if (selectedDays.includes(1)) {
      await setSelectedDays([lastDayLastMonth.getDate()])
      await setIsEndingMonthOfReservation(false)
      await setIsStartingMonthOfReservation(true)
    }
    setCurrentDate(lastDayLastMonth)

  }

  const handlers = useSwipeable({
    onSwipedLeft: () => nextMonth(),
    onSwipedRight: () => prevMonth(),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true
  });



  const isOverlap = (newSelection: number[], returnEarliest: boolean = false, returnLatest: boolean = false): { start?: number, end?: number } | null => {
    let overlappingReservations = currentMonthReservations.filter(reservation => {
      const reservationStart = new Date(reservation.dateStart).getDate();
      const reservationEnd = new Date(reservation.dateEnd).getDate();
      return (newSelection[0] <= reservationEnd && newSelection[newSelection.length - 1] >= reservationStart);
    });

    if (overlappingReservations.length === 0) {
      setIntersectingDepartureHour(null)
      setIntersectingArrivalHour(null)
      return null;
    }

    if (returnEarliest) {

      const earliestOverlap = overlappingReservations.reduce((earliest, reservation) => {
        const reservationStart = new Date(reservation.dateStart).getDate();
        if (newSelection[newSelection.length - 1] >= reservationStart &&
          (!earliest || reservationStart < earliest.getDate())) {
          return new Date(reservation.dateStart);
        }
        return earliest;
      }, null as Date | null);

      if (earliestOverlap) {
        setIntersectingDepartureHour(earliestOverlap.getHours());
        return { start: earliestOverlap.getDate() };
      }
    }

    if (returnLatest) {
      const latestOverlap = overlappingReservations.reduce((latest, reservation) => {
        const reservationEnd = new Date(reservation.dateEnd).getDate();
        if (newSelection[0] <= reservationEnd &&
          reservationEnd <= newSelection[newSelection.length - 1] &&
          (!latest || reservationEnd > latest.getDate())) {
          return new Date(reservation.dateEnd);
        }
        return latest;
      }, null as Date | null);
      console.log("LATEST", latestOverlap)
      if (latestOverlap) {

        setIntersectingArrivalHour(latestOverlap.getHours());
        return { end: latestOverlap.getDate() };
      } else {
        return null;
      }
    }




    let intersectingStart;
    let intersectingEnd;

    overlappingReservations.forEach(reservation => {
      const reservationStart = new Date(reservation.dateStart);
      const reservationEnd = new Date(reservation.dateEnd);

      //Overalp at start
      if (newSelection[0] <= reservationEnd.getDate() && newSelection[0] > reservationStart.getDate()) {
        if (reservationEnd)
          intersectingStart = reservationEnd;
      }

      //Overlap at end
      if (newSelection[newSelection.length - 1] >= reservationStart.getDate() && newSelection[newSelection.length - 1] < reservationEnd.getDate()) {
        intersectingEnd = reservationStart;
      }
    });



    console.log("INTERSECTING", intersectingStart, intersectingEnd)

    setIntersectingDepartureHour(intersectingEnd ? (intersectingEnd as Date).getHours() : null)
    setIntersectingArrivalHour(intersectingStart ? (intersectingStart as Date).getHours() : null)

    return { start: intersectingStart, end: intersectingEnd }

  };


  const handleDayClick = (day: number, event: React.MouseEvent | React.TouchEvent) => {
    // For mouse events, prevent default behavior
    if (event.type === 'click') {
      event.preventDefault();
    }

    // returns the reservation that was clicked 
    const reservationOnDay = currentMonthReservations.find(reservation => {
      const startDate = new Date(Math.max(reservation.dateStart.getTime(), new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime()));
      const endDate = new Date(Math.min(reservation.dateEnd.getTime(), new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getTime()));


      return day >= startDate.getDate() && day <= endDate.getDate();
    });

    if (reservationOnDay) {
      if (reservationOnDay.dateStart.getMonth() < currentDate.getMonth()) {
        setIsEndingMonthOfReservation(true)
        setIsStartingMonthOfReservation(false)
      }
      if (reservationOnDay.dateEnd.getMonth() > currentDate.getMonth()) {
        setIsEndingMonthOfReservation(false)
        setIsStartingMonthOfReservation(true)
      }

      isOverlap([reservationOnDay.dateStart.getDate(), reservationOnDay.dateEnd.getDate()])

      updateEditingReservation(reservationOnDay);

    }
    handleDayInteractionStart(day);
  };

  const handleDayInteractionStart = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isWithinExistingReservation = currentMonthReservations.some(reservation => {
      const startDate = new Date(reservation.dateStart);
      const endDate = new Date(reservation.dateEnd);
      return selectedDate >= startDate && selectedDate <= endDate;
    });

    if (isEditing && editingReservation) {
      const startDay = editingReservation.dateStart!.getDate();
      const endDay = editingReservation.dateEnd!.getDate();
      if (day === startDay) {
        setAdjustingEnd('start');
      } else if (day === endDay) {
        setAdjustingEnd('end');
      } else {
        setAdjustingEnd('end'); // Default to adjusting end when clicking in
      }
      setIsSelecting(true);
      setSelectedDays(range(startDay || 1, endDay || 2));

      /* return; */
    }

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
    }


    if (!isWithinExistingReservation) {
      setIsSelecting(true);
      setSelectedDays([day]);
      setAdjustingEnd('end');

      const startDate = new Date(selectedDate);
      startDate.setHours(userSetting.checkInHour, 0, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(userSetting.checkOutHour, 0, 0, 0);
      console.log(startDate, endDate)
      resetEditingReservation();
      updateEditingReservation({
        dateStart: startDate,
        dateEnd: endDate,
      });
      const newSelection = [startDate.getDate(), endDate.getDate()];
      isOverlap(newSelection)
    }
  }

  const handleDayInteractionMove = async (day: number) => {
    if (isSelecting) {
      setSelectedDays(prevSelected => {
        if (prevSelected.length === 0) return [day];

        let firstSelected = prevSelected[0];
        let lastSelected = prevSelected[prevSelected.length - 1];

        if (isEditing) {
          firstSelected = editingReservation.dateStart.getDate();
          lastSelected = editingReservation.dateEnd.getDate();
          if (isEndingMonthOfReservation) {
            firstSelected = 0;
            lastSelected = editingReservation.dateEnd!.getDate();
          }
          if (isStartingMonthOfReservation) {
            firstSelected = editingReservation.dateStart!.getDate();
            lastSelected = daysInMonth;
          }
        }

        let newSelection: number[] = [];

        if (adjustingEnd === 'start') {
          // Adjusting start date
          newSelection = range(Math.max(day, 1), lastSelected)

        }
        if (adjustingEnd === 'end') {
          // Adjusting end date
          newSelection = range(firstSelected, Math.min(day, daysInMonth));

        }
        // newSeleciton
        // returnEarliest overlapping reservation.dateStart && newSelection[length-1], 
        // returnLatest overlapping reservation.dateEnd && newSelection[0]
        let adjustedSelection = newSelection;
        if (isEditing) {
          if (adjustingEnd === 'start') {
            adjustedSelection = [day, editingReservation.dateStart.getDate() - 1]
          }
          if (adjustingEnd === 'end') {
            adjustedSelection = [editingReservation.dateEnd.getDate() + 1, day]
          }
        }
        const overlap = isOverlap(adjustedSelection, (adjustingEnd === 'end'), (adjustingEnd === 'start'))
        if (overlap) {
          console.log("OVVDR")
          setIsSelecting(false);
          if (overlap.start) {
            return [...prevSelected, overlap.start]
          }
          if (overlap.end) {
            return [overlap.end, ...prevSelected]
          }

        }


        return newSelection;
      });
    }

  }

  const handleDayInteractionEnd = () => {
    setIsSelecting(false);
    setAdjustingEnd('end');
    if (selectedDays.length > 0) {
      let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDays[0]);
      startDate.setHours(userSetting.checkInHour, 0, 0, 0);
      let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDays[selectedDays.length - 1]);
      endDate.setHours(userSetting.checkOutHour, 0, 0, 0);

      if (isEndingMonthOfReservation) {
        startDate = new Date(editingReservation.dateStart)
      }

      if (isStartingMonthOfReservation) {
        endDate = new Date(editingReservation.dateEnd)
      }
      updateEditingReservation({
        id: editingReservation.id,
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
    if (editingReservation.dateStart && editingReservation.dateEnd) {
      const start = new Date(editingReservation.dateStart);
      const end = new Date(editingReservation.dateEnd);
      const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      currentMonthEnd.setHours(23, 59, 59, 999);

      //Includes reservations and existing edits that span
      if (start <= currentMonthEnd && end >= currentMonthStart) {
        const newSelectedDays = [];
        const rangeStart = start < currentMonthStart ? currentMonthStart : start;
        const rangeEnd = end > currentMonthEnd ? currentMonthEnd : end;

        for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
          if (d.getMonth() === currentDate.getMonth()) {
            newSelectedDays.push(d.getDate());
          }
        }

        // Ensure the last day of the reservation in this month is selected
        const lastDayInMonth = end > currentMonthEnd ? currentMonthEnd.getDate() : end.getDate();
        if (!newSelectedDays.includes(lastDayInMonth)) {
          newSelectedDays.push(lastDayInMonth);
        }
        setSelectedDays(newSelectedDays);
        setIsEndingMonthOfReservation(editingReservation.dateEnd > currentMonthStart && editingReservation.dateStart < currentMonthStart);
        setIsStartingMonthOfReservation(editingReservation.dateStart < currentMonthEnd && editingReservation.dateEnd > currentMonthEnd);

      }
      //Includes edits that should start/end to span
      //Is exlusively triggered by next/prev month
      else {
        if (isEndingMonthOfReservation) {
          updateEditingReservation({
            dateEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDays[0], userSetting.checkOutHour, 0, 0, 0),
          });
        }
        if (isStartingMonthOfReservation) {
          updateEditingReservation({
            dateStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDays[0], userSetting.checkInHour, 0, 0, 0),
          });
        }
        setSelectedDays([])
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
          <DayCell
            key={day}
            day={day}
            isEndingMonthOfReservation={isEndingMonthOfReservation}
            isStartingMonthOfReservation={isStartingMonthOfReservation}
            isSelected={selectedDays.includes(day)}
            isFirstSelected={isFirstSelected(day)}
            isLastSelected={isLastSelected(day)}
            isReservationStart={isReservationStart(day)}
            isReservationEnd={isReservationEnd(day)}
            isWithinReservation={isWithinReservation(day)}
            onDayClick={handleDayClick}
            onDayInteractionStart={handleDayInteractionStart}
            onDayInteractionMove={handleDayInteractionMove}
            onDayInteractionEnd={handleDayInteractionEnd}
          />
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