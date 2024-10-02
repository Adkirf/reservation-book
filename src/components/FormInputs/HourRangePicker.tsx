'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Clock, ChevronRight, Home } from 'lucide-react'
import { useReservation } from '@/contexts/ReservationProvider'

type Step = 'arrival' | 'departure'

const HourPicker = ({ value, onChange, intersectingHour, currentStep }: {
  value: number,
  onChange: (hour: number) => void,
  intersectingHour: number | null,
  currentStep: Step
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const isDisabled = (hour: number) => {
    if (currentStep === 'arrival' && intersectingHour !== null) {
      return hour <= intersectingHour;
    } else if (currentStep === 'departure' && intersectingHour !== null) {
      return hour >= intersectingHour;
    }
    return false;
  }

  return (
    <div className="grid grid-cols-6 gap-1">
      {hours.map(hour => (
        <Button
          key={hour}
          variant="outline"
          className={`p-1 text-xs ${value === hour ? 'bg-primary text-primary-foreground' :
            isDisabled(hour) ? 'bg-gray-100 text-gray-400' : ''
            }`}
          onClick={() => onChange(hour)}
          disabled={isDisabled(hour)}
        >
          {hour.toString().padStart(2, '0')}
        </Button>
      ))}
    </div>
  )
}

const Breadcrumbs = ({ currentStep }: { currentStep: Step }) => {
  return (
    <nav className="flex items-center space-x-1 text-xs mb-2" aria-label="Breadcrumb">
      <Home className="h-3 w-3" />
      <ChevronRight className="h-3 w-3" />
      <span className={currentStep === 'arrival' ? 'font-semibold' : ''}>Arrival</span>
      <ChevronRight className="h-3 w-3" />
      <span className={currentStep === 'departure' ? 'font-semibold' : ''}>Departure</span>
    </nav>
  )
}

interface HourRangePickerProps {
  onHourRangeChange: (dateRange: [Date, Date]) => void;
}

export function HourRangePickerComponent({ onHourRangeChange }: HourRangePickerProps) {
  const { editingReservation, updateEditingReservation, intersectingArrivalHour, intersectingDepartureHour } = useReservation()
  const [arrival, setArrival] = useState<number>(0)
  const [departure, setDeparture] = useState<number>(1)
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>('arrival')
  const [popoverWidth, setPopoverWidth] = useState<number>(0)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (editingReservation.dateStart instanceof Date && !isNaN(editingReservation.dateStart.getTime()) &&
      editingReservation.dateEnd instanceof Date && !isNaN(editingReservation.dateEnd.getTime())) {

      setArrival(editingReservation.dateStart.getHours())
      setDeparture(editingReservation.dateEnd.getHours())
    }
  }, [editingReservation])

  useEffect(() => {
    console.log("INTERSECTING", intersectingArrivalHour, intersectingDepartureHour)
  }, [intersectingArrivalHour, intersectingDepartureHour])

  useEffect(() => {
    const updateWidth = () => {
      if (triggerRef.current) {
        const newWidth = Math.max(triggerRef.current.offsetWidth, 320) // Minimum width of 320px
        setPopoverWidth(newWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`
  }

  const handleArrivalChange = (newArrival: number) => {
    setArrival(newArrival)
    setCurrentStep('departure')
    updateDateRange(newArrival, departure)
  }

  const handleDepartureChange = (newDeparture: number) => {
    setDeparture(newDeparture)
    setIsOpen(false)
    setCurrentStep('arrival') // Reset for next opening
    updateDateRange(arrival, newDeparture)
  }

  const updateDateRange = (newArrival: number, newDeparture: number) => {
    const updatedArrival = new Date(editingReservation.dateStart || new Date())
    updatedArrival.setHours(newArrival, 0, 0, 0)

    const updatedDeparture = new Date(editingReservation.dateEnd || new Date())
    updatedDeparture.setHours(newDeparture, 0, 0, 0)

    updateEditingReservation({
      dateStart: updatedArrival,
      dateEnd: updatedDeparture
    })
    onHourRangeChange([updatedArrival, updatedDeparture])
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setCurrentStep('arrival') // Reset step when closing
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          className="w-full justify-start text-left font-normal text-sm"
          onClick={() => setIsOpen(true)}
        >
          <Clock className="mr-2 h-4 w-4" />
          <span>{formatHour(arrival)} - {formatHour(departure)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-2"
        style={{ width: `${popoverWidth}px`, maxWidth: '100vw' }}
      >
        <Breadcrumbs currentStep={currentStep} />
        <div className="space-y-2">
          {currentStep === 'arrival' ? (
            <div>
              <h4 className="font-medium text-sm mb-1">Select Arrival Hour</h4>
              <HourPicker
                value={arrival}
                onChange={handleArrivalChange}
                intersectingHour={intersectingArrivalHour}
                currentStep={currentStep}
              />
            </div>
          ) : (
            <div>
              <h4 className="font-medium text-sm mb-1">Select Departure Hour</h4>
              <HourPicker
                value={departure}
                onChange={handleDepartureChange}
                intersectingHour={intersectingDepartureHour}
                currentStep={currentStep}
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}