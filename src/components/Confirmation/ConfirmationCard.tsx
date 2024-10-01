'use client'

import { format } from 'date-fns'
import { PlaneLanding, PlaneTakeoff, Users, MessageSquare, Phone, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Reservation } from '@/lib/projectTypes'

export default function ConfirmationCard({
  reservation
}: {
  reservation: Reservation
}) {
  return (
    <div className="p-4 flex flex-col items-center h-full overflow-x-auto">
      <Card className="w-full max-w-md shadow-lg flex flex-col h-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Booking Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 overflow-x-auto flex-grow">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">{reservation.name}</h2>
            <Badge variant="secondary" className="text-sm">
              Reservation ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <PlaneLanding className="text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Check-in</p>
              <p className="font-medium">{format(reservation.dateStart, 'MMM dd, yyyy')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <PlaneTakeoff className="text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <p className="font-medium">{format(reservation.dateEnd, 'MMM dd, yyyy')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Users className="text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Guests</p>
              <p className="font-medium">{reservation.numberOfPeople} {reservation.numberOfPeople === 1 ? 'person' : 'people'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MessageSquare className="text-primary mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Comment</p>
              <p className="font-medium">{reservation.comment || 'No comment provided'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Contact Information:</p>
            {reservation.contact.map((info, index) => (
              <div key={index} className="flex items-center space-x-2">
                {info.includes('@') ? <Mail className="text-primary" size={16} /> : <Phone className="text-primary" size={16} />}
                <p className="text-sm">{info}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}