"use client"

import { useRef } from 'react'
import { format } from 'date-fns'
import { useSwipeable } from 'react-swipeable'
import { useReservation } from '@/contexts/ReservationProvider'
import { useRouter } from 'next/navigation'

export default function Component() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { reservations } = useReservation()
  const router = useRouter()

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

  const handleReservationClick = (reservationId: string) => {
    router.push(`/confirmation/${reservationId}`)
  }

  return (
    <div className="relative w-full h-full justify-center items-center flex max-w-3xl mx-auto">
      <div
        {...handlers}
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex-none w-72 h-40 snap-start flex flex-col items-start justify-center p-4 border border-gray-200 rounded-lg m-2 bg-white shadow-sm relative cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleReservationClick(reservation.id)}
          >
            <h3 className="text-lg font-bold mb-2">{reservation.name}</h3>
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