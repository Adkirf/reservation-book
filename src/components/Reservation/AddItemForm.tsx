"use client"

import React, { useEffect, useState } from "react"
import { X, ChevronLeft, ChevronRight, Calendar, Clock, User, FileText, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useReservation } from "@/contexts/ReservationProvider"
import { Reservation } from "@/lib/projectTypes"
import { DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer"
import { HourRangePickerComponent } from "@/components/FormInputs/HourRangePicker"
import DateRangePicker from "@/components/FormInputs/DayRangePicker"
import { DateRange } from "react-day-picker"
import { NumberInput } from "@/components/FormInputs/NumberInput"

interface AddItemFormProps {
  onClose: () => void;
}

export function AddItemForm({ onClose }: AddItemFormProps) {
  const {
    editingReservation,
    addNewReservation,
    updateReservation,
    updateEditingReservation,
    resetEditingReservation // Add this
  } = useReservation()

  useEffect(() => {
    if (!editingReservation) {
      resetEditingReservation();
    }
  }, [editingReservation, resetEditingReservation]);

  const [page, setPage] = useState(0)
  const [validity, setValidity] = useState<Record<keyof Reservation, "valid" | "invalid" | "empty">>({
    id: "valid",
    name: "empty",
    dateStart: "empty",
    dateEnd: "empty",
    comment: "empty",
    numberOfPeople: "valid",
    contact: "empty",
  })
  const [changedFields, setChangedFields] = useState<Set<keyof Reservation>>(new Set())
  const [hasChanges, setHasChanges] = useState(false)

  const isEditing = !!editingReservation?.id

  useEffect(() => {
    if (editingReservation) {
      const newValidity: Record<keyof Reservation, "valid" | "invalid" | "empty"> = {} as Record<keyof Reservation, "valid" | "invalid" | "empty">
      Object.keys(editingReservation).forEach((key) => {
        const typedKey = key as keyof Reservation
        newValidity[typedKey] = validateField(typedKey, editingReservation[typedKey])
      })
      setValidity(newValidity)
    }
  }, [editingReservation])

  useEffect(() => {
    setHasChanges(changedFields.size > 0)
  }, [changedFields])

  const validateField = (field: keyof Reservation, value: any): "valid" | "invalid" | "empty" => {
    if (value === "" || value === null) return "empty"
    switch (field) {
      case "name":
        return (value as string).length >= 3 ? "valid" : "invalid"
      case "dateStart":
      case "dateEnd":
        return value instanceof Date && !isNaN(value.getTime()) ? "valid" : "invalid"
      case "numberOfPeople":
        return typeof value === 'number' && value > 0 ? "valid" : "invalid"
      case "comment":
      case "contact":
        return "valid"
      default:
        return "valid"
    }
  }

  const handleSubmit = async () => {
    const requiredFields: (keyof Reservation)[] = ['name', 'dateStart', 'dateEnd', 'numberOfPeople']

    if (requiredFields.every((field) => validity[field] === "valid") && editingReservation) {
      try {
        if (isEditing) {
          await updateReservation(editingReservation.id!, editingReservation);
        } else {
          await addNewReservation(editingReservation as Omit<Reservation, 'id'>);
        }
        resetEditingReservation(); // Reset the form after successful submission
        setPage(0);
        onClose();
      } catch (error) {
        console.error('Error submitting reservation:', error);
        alert("An error occurred while submitting the reservation. Please try again.");
      }
    } else {
      alert("Please fill in all required fields correctly.");
    }
  }

  const updateField = (field: keyof Reservation, value: any) => {
    updateEditingReservation({ [field]: value });

    if (isEditing) {
      if (JSON.stringify(editingReservation?.[field]) !== JSON.stringify(value)) {
        setChangedFields(prev => new Set(prev).add(field))
      } else {
        setChangedFields(prev => {
          const newSet = new Set(prev)
          newSet.delete(field)
          return newSet
        })
      }
    }

    const newValidity = { ...validity }
    newValidity[field] = validateField(field, value)
    setValidity(newValidity)
  }

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    if (dateRange?.from && dateRange?.to) {
      updateField("dateStart", dateRange.from)
      updateField("dateEnd", dateRange.to)
    }
  }

  const handleHourRangeChange = (hourRange: [Date, Date]) => {
    const [newStart, newEnd] = hourRange

    if (editingReservation) {
      const updatedStart = new Date(editingReservation.dateStart || new Date())
      updatedStart.setHours(newStart.getHours(), newStart.getMinutes(), 0, 0)

      const updatedEnd = new Date(editingReservation.dateEnd || new Date())
      updatedEnd.setHours(newEnd.getHours(), newEnd.getMinutes(), 0, 0)

      updateField("dateStart", updatedStart)
      updateField("dateEnd", updatedEnd)
    }
  }

  const pages = [
    {
      title: "Basic Info",
      icon: <FileText className="h-4 w-4" />,
      fields: ["name", "comment"],
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editingReservation?.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Enter reservation name"
            />
          </div>
          <div>
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={editingReservation?.comment || ""}
              onChange={(e) => updateField("comment", e.target.value)}
              placeholder="Enter reservation details"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Date and Time",
      icon: <Calendar className="h-4 w-4" />,
      fields: ["dateStart", "dateEnd"],
      content: (
        <div className="space-y-4">
          <div>
            <Label>Date Range</Label>
            <DateRangePicker
              currentDateRange={editingReservation && editingReservation.dateStart && editingReservation.dateEnd ? [editingReservation.dateStart, editingReservation.dateEnd] : undefined}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>
          <div>
            <Label>Time Range</Label>
            <HourRangePickerComponent
              currentHourRange={editingReservation && editingReservation.dateStart && editingReservation.dateEnd ? [editingReservation.dateStart, editingReservation.dateEnd] : [new Date(), new Date()]}
              onHourRangeChange={handleHourRangeChange}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Additional Info",
      icon: <User className="h-4 w-4" />,
      fields: ["numberOfPeople", "contact"],
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="numberOfPeople">Number of People</Label>
            <NumberInput
              currentNumber={editingReservation?.numberOfPeople || 1}
              onNumberChange={(value) => updateField("numberOfPeople", value)}
            />
          </div>
          <div>
            <Label htmlFor="contact">Contact (Optional)</Label>
            <Input
              id="contact"
              value={editingReservation?.contact?.join(', ') || ''}
              onChange={(e) => updateField("contact", e.target.value.split(',').map(s => s.trim()))}
              placeholder="Enter contact information (comma-separated)"
            />
          </div>
        </div>
      ),
    },
  ]

  const getPageColor = (pageIndex: number) => {
    if (pageIndex > page) return "bg-gray-300" // Upcoming pages are always grey
    const pageFields = pages[pageIndex].fields
    const pageValidity = pageFields.map((field) => {
      // Consider optional fields as always valid
      if (field === "comment" || field === "contact") {
        return "valid"
      }
      return validity[field as keyof Reservation]
    })

    if (pageValidity.every((v) => v === "valid")) {
      // Check if any field on this page has changed
      const hasChangedField = pageFields.some(field => changedFields.has(field as keyof Reservation))
      if (isEditing) {
        return hasChangedField ? "bg-yellow-500" : "bg-gray-300"
      }
      return "bg-green-500"
    }
    return "bg-red-500" // If any required field is empty or invalid
  }

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{isEditing ? "Edit Reservation" : "Add New Reservation"}</DrawerTitle>
        <DrawerDescription>{pages[page].title}</DrawerDescription>
      </DrawerHeader>
      <div className="p-4 pb-0">
        {editingReservation && pages[page].content}
      </div>
      <DrawerFooter className="flex justify-between items-center">
        <div className="flex space-x-2">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${getPageColor(index)}`}
            />
          ))}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          {page === pages.length - 1 ? (
            <Button onClick={handleSubmit} disabled={isEditing && !hasChanges}>
              Submit
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((prev) => Math.min(pages.length - 1, prev + 1))}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          )}
        </div>
      </DrawerFooter>
    </DrawerContent>
  )
}