'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Reservation } from '@/lib/projectTypes'
import ConfirmationCard from '@/components/Confirmation/ConfirmationCard'
import DaySwiper from '@/components/Confirmation/DaySwiper'
import LoadingCircle from '@/components/ui/LoadingCircle'

// Dummy data function to simulate fetching a reservation
const fetchReservation = (id: string): Reservation => {
    return {
        id: id,
        name: "John Doe",
        dateStart: new Date(),
        dateEnd: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours later
        comment: "Special request: Window seat",
        numberOfPeople: 4,
        contact: ["johndoe@example.com", "+1234567890"]
    }
}

export default function ConfirmationPage() {
    const params = useParams()
    const id = params.id as string
    const [reservation, setReservation] = useState<Reservation | null>(null)

    useEffect(() => {
        // Simulate API call
        const fetchedReservation = fetchReservation(id)
        setReservation(fetchedReservation)
    }, [id])

    const handleDateChange = (newDate: Date) => {
        // In a real scenario, this would fetch new data for the selected date
        console.log("Fetching data for:", newDate)
        // For now, we'll just update the dummy data with the new date
        if (reservation) {
            const newReservation = {
                ...reservation,
                dateStart: newDate,
                dateEnd: new Date(newDate.getTime() + 2 * 60 * 60 * 1000)
            }
            setReservation(newReservation)
        }
    }

    if (!reservation) {
        return <LoadingCircle />
    }

    return (
        <div className="flex flex-col h-full w-full ">
            <DaySwiper onDateChange={handleDateChange} />
            <ConfirmationCard reservation={reservation} />
        </div>
    )
}