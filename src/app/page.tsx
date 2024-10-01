'use client';

import { useState, useEffect } from 'react'
import { Reservation } from '@/lib/projectTypes'
import ConfirmationCard from '@/components/Confirmation/ConfirmationCard'
import DaySwiper from '@/components/Confirmation/DaySwiper'
import LoadingCircle from '@/components/ui/LoadingCircle'
import { useReservation } from '@/contexts/ReservationProvider'

export default function Home() {
  const { reservations, isLoading, fetchAllReservations } = useReservation()
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  useEffect(() => {
    fetchAllReservations()
  }, [fetchAllReservations])

  useEffect(() => {
    if (reservations.length > 0 && !selectedReservation) {
      setSelectedReservation(reservations[0])
    }
  }, [reservations, selectedReservation])

  const handleReservationChange = (newReservation: Reservation) => {
    setSelectedReservation(newReservation)
  }

  if (isLoading || reservations.length === 0 || !selectedReservation) {
    return <LoadingCircle />
  }

  return (
    <div className="flex flex-col h-full w-full p-4">
      <DaySwiper />
    </div>
  )
}
