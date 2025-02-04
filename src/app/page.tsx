'use client';

import { useState, useEffect } from 'react'
import { Reservation } from '@/lib/projectTypes'
import ConfirmationCard from '@/components/Confirmation/ConfirmationCard'
import DaySwiper from '@/components/Confirmation/DaySwiper'
import LoadingCircle from '@/components/ui/LoadingCircle'
import { useReservation } from '@/contexts/ReservationProvider'
import { useAuth } from '@/contexts/AuthProvider'

export default function Home() {
  const { reservations, isLoading, fetchAllReservations } = useReservation()
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const { t } = useAuth()

  useEffect(() => {
    fetchAllReservations()
  }, [fetchAllReservations])

  useEffect(() => {
    if (reservations.length > 0 && !selectedReservation) {
      setSelectedReservation(reservations[0])
    }
  }, [reservations, selectedReservation])

  if (isLoading) {
    return <LoadingCircle />
  }
  if (reservations.length === 0) {
    return <div className="flex flex-col h-full w-full p-4">
      {t('home.noReservations')}
    </div>
  }

  return (
    <div className="flex flex-col h-full w-full p-4">
      <DaySwiper />
    </div>
  )
}
