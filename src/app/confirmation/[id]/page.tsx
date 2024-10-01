'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Reservation } from '@/lib/projectTypes'
import ConfirmationCard from '@/components/Confirmation/ConfirmationCard'
import DaySwiper from '@/components/Confirmation/DaySwiper'
import LoadingCircle from '@/components/ui/LoadingCircle'
import { getReservationById } from '@/lib/firebase/firestore'
import { useToast } from '@/hooks/use-toast'

export default function ConfirmationPage() {
    const params = useParams()
    const id = params.id as string
    const [reservation, setReservation] = useState<Reservation | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        const fetchReservation = async () => {
            setIsLoading(true)
            try {
                const fetchedReservation = await getReservationById(id)
                setReservation(fetchedReservation)
            } catch (error) {
                console.error('Error fetching reservation:', error)
                toast({
                    title: 'Error',
                    description: 'Failed to load reservation. Please try again.',
                    variant: 'destructive',
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchReservation()
    }, [id, toast])


    if (isLoading) {
        return <LoadingCircle />
    }

    if (!reservation) {
        return <div>Reservation not found</div>
    }

    return (
        <div className="flex flex-col h-full w-full ">
            <ConfirmationCard reservation={reservation} />
        </div>
    )
}