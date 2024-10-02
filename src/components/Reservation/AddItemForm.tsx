"use client"

import React, { useEffect, useState } from "react"
import { X, ChevronLeft, ChevronRight, Calendar, Clock, User, FileText, MapPin, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useReservation } from "@/contexts/ReservationProvider"
import { Reservation } from "@/lib/projectTypes"
import { DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer"
import { HourRangePickerComponent } from "@/components/FormInputs/HourRangePicker"
import DayRangePicker from "@/components/FormInputs/DayRangePicker"
import { DateRange } from "react-day-picker"
import { NumberInput } from "@/components/FormInputs/NumberInput"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DialogTitle } from "@radix-ui/react-dialog"

interface AddItemFormProps {
  onClose: () => void;
  initialPage?: number; // New prop
}

export function AddItemForm({ onClose, initialPage = 0 }: AddItemFormProps) {
  const {
    editingReservation,
    addNewReservation,
    updateReservation,
    updateEditingReservation,
    resetEditingReservation,
    resetChanges,
    setIsEditing,
    reservations,
    deleteReservation,
  } = useReservation()

  const [page, setPage] = useState(initialPage)
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

  const isEditing = !!editingReservation?.id

  useEffect(() => {
    if (!editingReservation) {
      resetEditingReservation();
    }
  }, [editingReservation, resetEditingReservation]);

  useEffect(() => {
    if (editingReservation) {
      const newValidity: Record<keyof Reservation, "valid" | "invalid" | "empty"> = {} as Record<keyof Reservation, "valid" | "invalid" | "empty">
      Object.keys(editingReservation).forEach((key) => {
        const typedKey = key as keyof Reservation
        newValidity[typedKey] = validateField(typedKey, editingReservation[typedKey])
      })
      setValidity(newValidity)

      // Compare editingReservation with the original reservation
      if (isEditing) {
        const originalReservation = reservations.find(r => r.id === editingReservation.id)
        if (originalReservation) {
          const newChangedFields = new Set<keyof Reservation>()
          Object.keys(editingReservation).forEach((key) => {
            const typedKey = key as keyof Reservation
            if (JSON.stringify(editingReservation[typedKey]) !== JSON.stringify(originalReservation[typedKey])) {
              newChangedFields.add(typedKey)
            }
          })
          setChangedFields(newChangedFields)
        }
      } else {
        // If it's a new reservation, all fields are considered changed
        setChangedFields(new Set(Object.keys(editingReservation) as (keyof Reservation)[]))
      }
    }

  }, [editingReservation, initialPage, isEditing, reservations])

  useEffect(() => {
    setPage(initialPage)
  }, [initialPage])

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
      const originalReservation = reservations.find(r => r.id === editingReservation?.id)
      if (originalReservation) {
        if (JSON.stringify(originalReservation[field]) !== JSON.stringify(value)) {
          setChangedFields(prev => new Set(prev).add(field))
        } else {
          setChangedFields(prev => {
            const newSet = new Set(prev)
            newSet.delete(field)
            return newSet
          })
        }
      }
    } else {
      // For new reservations, always consider fields as changed
      setChangedFields(prev => new Set(prev).add(field))
    }

    const newValidity = { ...validity }
    newValidity[field] = validateField(field, value)
    setValidity(newValidity)
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

  const handleClose = () => {
    resetChanges()
    if (editingReservation.id) {

      setIsEditing(true)
    }
    onClose()
  }

  const handleDeleteReservation = async () => {
    if (editingReservation?.id) {
      try {
        await deleteReservation(editingReservation.id);
        onClose();
      } catch (error) {
        console.error('Error deleting reservation:', error);
        alert("An error occurred while deleting the reservation. Please try again.");
      }
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
              className="text-base" // Add this class to increase font size
            />
          </div>
          <div>
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={editingReservation?.comment || ""}
              onChange={(e) => updateField("comment", e.target.value)}
              placeholder="Enter reservation details"
              className="text-base" // Add this class to increase font size
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
            <Label>Time Range</Label>
            <HourRangePickerComponent
              onHourRangeChange={handleHourRangeChange}
            />
          </div>
          <div>
            <Label>Date Range</Label>
            <DayRangePicker
              currentDateRange={editingReservation.dateStart && editingReservation.dateEnd ? [editingReservation.dateStart, editingReservation.dateEnd] : [new Date(), new Date(new Date().setDate(new Date().getDate() + 1))]}
              onClose={handleClose}
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
              className="text-base" // Add this class to increase font size
            />
          </div>
          <div>
            <Label htmlFor="contact">Contact (Optional)</Label>
            <Input
              id="contact"
              value={editingReservation?.contact?.join(', ') || ''}
              onChange={(e) => updateField("contact", e.target.value.split(',').map(s => s.trim()))}
              placeholder="Enter contact information (comma-separated)"
              className="text-base" // Add this class to increase font size
            />
          </div>
        </div>
      ),
    },
  ]


  // Update the getPageColor function
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
      if (isEditing && editingReservation?.id) {
        const hasChangedField = pageFields.some(field => changedFields.has(field as keyof Reservation));
        return hasChangedField ? "bg-yellow-500" : "bg-green-500"
      }
      return "bg-green-500"
    }
    return "bg-red-500" // If any required field is empty or invalid
  }


  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{isEditing ? "Edit Reservation" : "Add New Reservation"}</DrawerTitle>
        <DrawerDescription className="flex justify-between items-center">
          <span>{pages[page].title}</span>
          {isEditing && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Delete Reservation">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the reservation.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteReservation}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4 pb-0">
        {editingReservation && (
          <div className="text-base">
            {pages[page].content}
          </div>
        )}
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
            <Button onClick={handleSubmit} disabled={isEditing && changedFields.size === 0}>
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