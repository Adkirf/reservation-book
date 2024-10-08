'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Reservation } from '@/lib/projectTypes'
import ConfirmationCard from '@/components/Confirmation/ConfirmationCard'
import DaySwiper from '@/components/Confirmation/DaySwiper'
import LoadingCircle from '@/components/ui/LoadingCircle'
import { getReservationById } from '@/lib/firebase/firestore'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthProvider'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

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
        return <div className="flex flex-col justify-center items-center h-full w-full">
            <LoadingCircle />
        </div>
    }

    if (!reservation) {
        return <div>Reservation not found</div>
    }

    const { t, user } = useAuth();
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="flex flex-col h-full w-full ">
            {user?.role && (
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-4 h-12 w-12 flex justify-center items-center"
                    onClick={handleGoBack}
                >
                    <ArrowLeft className="h-6 w-6" />
                    <span className="sr-only">{t('confirmation.goBack')}</span>
                </Button>
            )}
            <ConfirmationCard reservation={reservation} />
        </div>
    )
}