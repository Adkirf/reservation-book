'use client'

import { format } from 'date-fns'
import { PlaneLanding, PlaneTakeoff, Users, MessageSquare, Phone, Mail, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Reservation } from '@/lib/projectTypes'
import { ShareComponent } from './ShareComponent'
import { Button } from "@/components/ui/button"

export default function ConfirmationCard({
  reservation
}: {
  reservation: Reservation
}) {
  return (
    <div className="p-4 flex flex-col items-center h-full overflow-x-auto">
      <Card className="w-full max-w-md shadow-lg flex flex-col h-full">
        <CardHeader className="text-center flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {reservation.name}
          </CardTitle>
          <ShareComponent reservationId={reservation.id}>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex justify-center items-center">
              <Upload className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </ShareComponent>
        </CardHeader>
        <CardContent className="space-y-6 overflow-x-auto flex-grow">

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