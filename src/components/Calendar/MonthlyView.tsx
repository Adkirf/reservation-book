"use client"

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function MobileCalendar() {
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
    setIsSelecting(true)
    setSelectedDays([day])
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
        return newSelection.sort((a, b) => a - b)
      })
    }
  }

  const handleDayInteractionEnd = () => {
    setIsSelecting(false)
  }

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
            className={`h-10 sm:h-12 flex items-center justify-center text-sm rounded-full 
              ${isToday(day) ? 'bg-primary text-primary-foreground font-bold' : ''}
              ${selectedDays.includes(day) ? 'bg-secondary text-secondary-foreground' : ''}
              ${!selectedDays.includes(day) && !isToday(day) ? 'hover:bg-muted' : ''}
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
      <div className="mt-4 text-sm text-muted-foreground">
        Selected days: {selectedDays.join(', ')}
      </div>
    </div>
  )
}