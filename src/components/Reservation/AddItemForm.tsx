"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Calendar, Clock, User, FileText, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useReservation, ReservationFormData } from "@/contexts/ReservationProvider"
import { Reservation } from "@/lib/projectTypes"
import { DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { HourRangePickerComponent } from "@/components/HourRangePicker"
import DateRangePicker from "@/components/DayRangePicker"
import { DateRange } from "react-day-picker"

interface AddItemFormProps {
  onClose: () => void;
  initialData?: Reservation;
  isEditing?: boolean;
}

export function AddItemForm({ onClose, initialData, isEditing = false }: AddItemFormProps) {
  const { addNewReservation, updateReservation } = useReservation()
  const [page, setPage] = useState(0)
  const [formData, setFormData] = useState<ReservationFormData | null>(null)
  const [validity, setValidity] = useState<Record<keyof ReservationFormData, "valid" | "invalid" | "empty">>({
    name: "empty",
    dateStart: "empty",
    dateEnd: "empty",
    comment: "empty",
    numberOfPeople: "valid",
    contact: "empty",
  })
  const [changedFields, setChangedFields] = useState<Set<keyof ReservationFormData>>(new Set())

  useEffect(() => {
    if (initialData) {
      setFormData(initialData as ReservationFormData)
    } else {
      setFormData({
        name: "",
        dateStart: new Date(),
        dateEnd: new Date(),
        comment: "",
        numberOfPeople: 1,
        contact: [],
      })
    }
  }, [initialData])

  const validateField = (field: keyof ReservationFormData, value: any): "valid" | "invalid" | "empty" => {
    console.log(formData)
    if (value === "" || value === null) return "empty"
    switch (field) {
      case "name":
        return (value as string).length >= 3 ? "valid" : "invalid"
      case "dateStart":
        return value instanceof Date && !isNaN(value.getTime()) ? "valid" : "invalid"
      case "dateEnd":
        return value instanceof Date && !isNaN(value.getTime()) ? "valid" : "invalid"
      case "numberOfPeople":
        return typeof value === 'number' && value > 0 ? "valid" : "invalid"
      // Optional fields are always considered valid
      case "comment":
      case "contact":
        return "valid"
      default:
        return "valid"
    }
  }

  useEffect(() => {
    if (formData) {
      const newValidity: Record<keyof ReservationFormData, "valid" | "invalid" | "empty"> = {} as Record<keyof ReservationFormData, "valid" | "invalid" | "empty">
      Object.keys(formData).forEach((key) => {
        const typedKey = key as keyof ReservationFormData
        newValidity[typedKey] = validateField(typedKey, formData[typedKey])
      })
      setValidity(newValidity)
    }
  }, [formData])

  const handleSubmit = async () => {
    const requiredFields: (keyof ReservationFormData)[] = ['name', 'dateStart', 'dateEnd', 'numberOfPeople']

    if (requiredFields.every((field) => validity[field] === "valid") && formData) {
      try {
        if (initialData?.id) {
          // Editing existing reservation
          await updateReservation(initialData.id, formData);
        } else {
          // Adding new reservation
          await addNewReservation(formData as Omit<Reservation, 'id'>);
        }
        setPage(0)
        onClose();
      } catch (error) {
        console.error('Error submitting reservation:', error);
        alert("An error occurred while submitting the reservation. Please try again.");
      }
    } else {
      alert("Please fill in all required fields correctly.");
    }
  }

  const updateField = (field: keyof ReservationFormData, value: any) => {
    setFormData(prev => {
      if (prev) {
        const newData = { ...prev, [field]: value }

        // Check if the new value is different from the initial value
        if (isEditing && initialData && JSON.stringify(initialData[field]) !== JSON.stringify(value)) {
          setChangedFields(prev => new Set(prev).add(field))
        } else {
          setChangedFields(prev => {
            const newSet = new Set(prev)
            newSet.delete(field)
            return newSet
          })
        }

        // Validate the updated field
        const newValidity = { ...validity }
        newValidity[field] = validateField(field, value)
        setValidity(newValidity)

        return newData
      }
      return null
    })
  }

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    if (dateRange?.from && dateRange?.to) {
      updateField("dateStart", dateRange.from)
      updateField("dateEnd", dateRange.to)
    }
  }

  const handleHourRangeChange = (hourRange: [Date, Date]) => {
    const [newStart, newEnd] = hourRange

    setFormData(prev => {
      if (prev) {
        const updatedStart = new Date(prev.dateStart)
        updatedStart.setHours(newStart.getHours(), newStart.getMinutes(), 0, 0)

        const updatedEnd = new Date(prev.dateEnd)
        updatedEnd.setHours(newEnd.getHours(), newEnd.getMinutes(), 0, 0)

        const newData = {
          ...prev,
          dateStart: updatedStart,
          dateEnd: updatedEnd
        }

        // Validate the updated fields
        const newValidity = { ...validity }
        newValidity.dateStart = validateField('dateStart', updatedStart)
        newValidity.dateEnd = validateField('dateEnd', updatedEnd)
        setValidity(newValidity)

        // Update changed fields
        if (isEditing && initialData) {
          if (initialData.dateStart.getTime() !== updatedStart.getTime()) {
            setChangedFields(prev => new Set(prev).add('dateStart'))
          }
          if (initialData.dateEnd.getTime() !== updatedEnd.getTime()) {
            setChangedFields(prev => new Set(prev).add('dateEnd'))
          }
        }

        return newData
      }
      return prev
    })
  }

  const getInitialHourRange = (): [Date, Date] => {
    const now = new Date()
    const later = new Date(now)
    later.setHours(later.getHours() + 1)

    if (formData?.dateStart instanceof Date && !isNaN(formData.dateStart.getTime()) &&
      formData?.dateEnd instanceof Date && !isNaN(formData.dateEnd.getTime())) {
      return [formData.dateStart, formData.dateEnd]
    }

    return [now, later]
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
              value={formData?.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Enter reservation name"
            />
          </div>
          <div>
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={formData?.comment || ""}
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
              currentDateRange={formData ? [formData.dateStart, formData.dateEnd] : undefined}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>
          <div>
            <Label>Time Range</Label>
            <HourRangePickerComponent
              currentHourRange={formData ? [formData.dateStart, formData.dateEnd] : [new Date(), new Date()]}
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
            <Input
              id="numberOfPeople"
              type="number"
              value={formData?.numberOfPeople || 1}
              onChange={(e) => updateField("numberOfPeople", parseInt(e.target.value))}
              placeholder="Enter number of people"
            />
          </div>
          <div>
            <Label htmlFor="contact">Contact (Optional)</Label>
            <Input
              id="contact"
              value={formData?.contact?.join(', ') || ''}
              onChange={(e) => updateField("contact", e.target.value.split(',').map(s => s.trim()))}
              placeholder="Enter contact information (comma-separated)"
            />
          </div>
          {/* Remove the reference input field */}
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
      console.log(field)
      console.log(validity[field as keyof ReservationFormData])
      return validity[field as keyof ReservationFormData]
    })

    if (pageValidity.every((v) => v === "valid")) {
      // Check if any field on this page has changed
      const hasChangedField = pageFields.some(field => changedFields.has(field as keyof ReservationFormData))
      if (isEditing && hasChangedField) {
        return "bg-yellow-500"
      }
      return "bg-green-500"
    }
    return "bg-red-500" // If any required field is empty or invalid
  }

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{initialData?.id ? "Edit Reservation" : "Add New Reservation"}</DrawerTitle>
        <DrawerDescription>{pages[page].title}</DrawerDescription>
      </DrawerHeader>
      <div className="p-4 pb-0">
        {formData && pages[page].content}
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
            <Button onClick={handleSubmit}>Submit</Button>
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