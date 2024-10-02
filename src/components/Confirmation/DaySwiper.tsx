"use client"

import { useRef } from 'react'
import { format } from 'date-fns'
import { useSwipeable } from 'react-swipeable'
import { useReservation } from '@/contexts/ReservationProvider'
import { Upload } from 'lucide-react'
import { ShareComponent } from '@/components/Confirmation/ShareComponent'

export default function Component() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { reservations } = useReservation()

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => scroll('right'),
    onSwipedRight: () => scroll('left'),
    delta: 10,
    trackMouse: true
  })

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div
        {...handlers}
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex-none w-72 h-40 snap-start flex flex-col items-start justify-center p-4 border border-gray-200 rounded-lg m-2 bg-white shadow-sm relative"
          >
            <div className='flex justify-between w-full'>
              <h3 className="text-lg font-bold mb-2">{reservation.name}</h3>
              <ShareComponent reservationId={reservation.id}>
                <Upload className="h-5 w-5 text-gray-400 cursor-pointer" />
              </ShareComponent>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              From: {format(new Date(reservation.dateStart), 'MMM d, yyyy')}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              To: {format(new Date(reservation.dateEnd), 'MMM d, yyyy')}
            </p>
            <p className="text-sm text-gray-600">
              People: {reservation.numberOfPeople}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}