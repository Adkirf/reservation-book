"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { format, addDays, startOfMonth, endOfMonth } from 'date-fns'
import { useSwipeable } from 'react-swipeable'

const generateDateRange = (start: Date, end: Date) => {
  const dates = []
  let currentDate = start
  while (currentDate <= end) {
    dates.push(currentDate)
    currentDate = addDays(currentDate, 1)
  }
  return dates
}

const startDate = startOfMonth(new Date())
const endDate = endOfMonth(addDays(startDate, 180))
const dateRange = generateDateRange(startDate, endDate)

export default function DaySwiper({ onDateChange }: { onDateChange: (date: Date) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isSwipeInProgress, setIsSwipeInProgress] = useState(false)

  const updateSelectedDate = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const dayWidth = 80 // w-20 = 5rem = 80px
      const middleIndex = Math.floor((scrollLeft + clientWidth / 2) / dayWidth)
      const newSelectedDate = dateRange[middleIndex]
      setSelectedDate(newSelectedDate)
      onDateChange(newSelectedDate)
    }
  }, [onDateChange])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 80 // One day width
      const targetScroll = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    }
  }

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }, [])

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      const handleScroll = () => {
        checkScroll()
        if (!isSwipeInProgress) {
          updateSelectedDate()
        }
      }
      scrollElement.addEventListener('scroll', handleScroll)
      checkScroll()
      return () => scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [checkScroll, updateSelectedDate, isSwipeInProgress])

  const handlers = useSwipeable({
    onSwipeStart: () => setIsSwipeInProgress(true),
    onSwiped: () => {
      setIsSwipeInProgress(false)
      updateSelectedDate()
    },
    onSwipedLeft: () => scroll('right'),
    onSwipedRight: () => scroll('left'),
    delta: 10,
    trackMouse: true
  })

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        {...handlers}
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {dateRange.map((date, index) => (
          <div
            key={index}
            className={`flex-none w-20 h-24 snap-center flex flex-col items-center justify-center border-r border-gray-200 last:border-r-0 ${format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
              ? 'bg-blue-100'
              : ''
              }`}
          >
            <span className="text-sm font-medium text-gray-600">{format(date, 'EEE')}</span>
            <span className="text-lg font-bold">{format(date, 'd')}</span>
            <span className="text-xs text-gray-500">{format(date, 'MMM')}</span>
          </div>
        ))}
      </div>
      {showLeftArrow && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>
      )}
      {showRightArrow && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      )}
    </div>
  )
}