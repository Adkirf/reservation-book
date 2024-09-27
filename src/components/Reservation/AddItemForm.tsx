"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Calendar, Clock, User, FileText, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useReservation, FormData } from "@/contexts/ReservationProvider"
import { dbItem, Reservation, Task } from "@/lib/projectTypes"
import { DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

type ItemType = "reservation" | "task"

interface AddItemFormProps {
  onClose: () => void;
}

export function AddItemForm({ onClose }: AddItemFormProps) {
  const { addingItem, updateAddingItem, resetAddingItem, addNewItem } = useReservation()
  const [page, setPage] = useState(0)
  const [validity, setValidity] = useState<Record<keyof FormData, "valid" | "invalid" | "empty">>({
    type: "valid",
    name: "empty",
    dateStart: "empty",
    dateEnd: "empty",
    comment: "empty",
    numberOfPeople: "valid",
    contact: "empty",
    assignedTo: "empty",
    reference: "empty",
  })

  useEffect(() => {
    if (!addingItem) {
      resetAddingItem()
    }
  }, [addingItem, resetAddingItem])

  const validateField = (field: keyof FormData, value: any): "valid" | "invalid" | "empty" => {
    if (value === "" || value === null) return "empty"
    switch (field) {
      case "name":
      case "assignedTo":
        return (value as string).length >= 3 ? "valid" : "invalid"
      case "dateStart":
      case "dateEnd":
        return value instanceof Date && !isNaN(value.getTime()) ? "valid" : "invalid"
      case "numberOfPeople":
        return typeof value === 'number' && value > 0 ? "valid" : "invalid"
      case "type":
        return ["reservation", "task"].includes(value as string) ? "valid" : "invalid"
      // Optional fields are always considered valid
      case "comment":
      case "contact":
      case "reference":
        return "valid"
      default:
        return "valid"
    }
  }

  useEffect(() => {
    if (addingItem) {
      const newValidity: Record<keyof FormData, "valid" | "invalid" | "empty"> = {} as Record<keyof FormData, "valid" | "invalid" | "empty">
      Object.keys(addingItem).forEach((key) => {
        const typedKey = key as keyof FormData
        newValidity[typedKey] = validateField(typedKey, addingItem[typedKey])
      })
      setValidity(newValidity)
    }
  }, [addingItem])

  const handleSubmit = async () => {
    const requiredFields: (keyof FormData)[] = ['type', 'name', 'dateStart', 'dateEnd']
    if (addingItem?.type === 'reservation') {
      requiredFields.push('numberOfPeople')
    } else {
      requiredFields.push('assignedTo')
    }

    if (requiredFields.every((field) => validity[field] === "valid") && addingItem) {
      try {
        await addNewItem(addingItem as Omit<dbItem, 'id'>);
        // Only close the drawer if the submission is successful
        onClose();
      } catch (error) {
        console.error('Error submitting item:', error);
        alert("An error occurred while submitting the item. Please try again.");
      }
    } else {
      alert("Please fill in all required fields correctly.");
      // Don't close the drawer if the form is invalid
    }
  }

  const reservationPages = [
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
              value={addingItem?.name || ""}
              onChange={(e) => updateAddingItem("name", e.target.value)}
              placeholder="Enter reservation name"
            />
          </div>
          <div>
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={addingItem?.comment || ""}
              onChange={(e) => updateAddingItem("comment", e.target.value)}
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
            <Label htmlFor="dateStart">Start Date and Time</Label>
            <Input
              id="dateStart"
              type="datetime-local"
              value={addingItem?.dateStart.toISOString().slice(0, 16) || ""}
              onChange={(e) => updateAddingItem("dateStart", new Date(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="dateEnd">End Date and Time</Label>
            <Input
              id="dateEnd"
              type="datetime-local"
              value={addingItem?.dateEnd.toISOString().slice(0, 16) || ""}
              onChange={(e) => updateAddingItem("dateEnd", new Date(e.target.value))}
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
              value={addingItem?.numberOfPeople || 1}
              onChange={(e) => updateAddingItem("numberOfPeople", parseInt(e.target.value))}
              placeholder="Enter number of people"
            />
          </div>
          <div>
            <Label htmlFor="contact">Contact (Optional)</Label>
            <Input
              id="contact"
              value={addingItem?.contact?.join(', ') || ''}
              onChange={(e) => updateAddingItem("contact", e.target.value.split(',').map(s => s.trim()))}
              placeholder="Enter contact information (comma-separated)"
            />
          </div>
        </div>
      ),
    },
  ]

  const taskPages = [
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
              value={addingItem?.name || ""}
              onChange={(e) => updateAddingItem("name", e.target.value)}
              placeholder="Enter task name"
            />
          </div>
          <div>
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={addingItem?.comment || ""}
              onChange={(e) => updateAddingItem("comment", e.target.value)}
              placeholder="Enter task details"
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
            <Label htmlFor="dateStart">Start Date and Time</Label>
            <Input
              id="dateStart"
              type="datetime-local"
              value={addingItem?.dateStart.toISOString().slice(0, 16) || ""}
              onChange={(e) => updateAddingItem("dateStart", new Date(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="dateEnd">End Date and Time</Label>
            <Input
              id="dateEnd"
              type="datetime-local"
              value={addingItem?.dateEnd.toISOString().slice(0, 16) || ""}
              onChange={(e) => updateAddingItem("dateEnd", new Date(e.target.value))}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Assignment and Reference",
      icon: <User className="h-4 w-4" />,
      fields: ["assignedTo", "reference"],
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              value={addingItem?.assignedTo || ""}
              onChange={(e) => updateAddingItem("assignedTo", e.target.value)}
              placeholder="Enter assignee ID"
            />
          </div>
          <div>
            <Label htmlFor="reference">Reference (Optional)</Label>
            <Input
              id="reference"
              value={addingItem?.reference || ""}
              onChange={(e) => updateAddingItem("reference", e.target.value)}
              placeholder="Enter reference ID (optional)"
            />
          </div>
        </div>
      ),
    },
  ]

  const pages = addingItem?.type === "reservation" ? reservationPages : taskPages

  const getPageColor = (pageIndex: number) => {
    if (pageIndex > page) return "bg-gray-300" // Upcoming pages are always grey

    const pageFields = pages[pageIndex].fields
    const pageValidity = pageFields.map((field) => {
      // Consider optional fields as always valid
      if (field === "comment" || field === "contact" || field === "reference") {
        return "valid"
      }
      return validity[field as keyof FormData]
    })

    if (pageValidity.every((v) => v === "valid")) return "bg-green-500"
    return "bg-red-500" // If any required field is empty or invalid
  }

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>
          <Select
            value={addingItem?.type}
            onValueChange={(value: ItemType) => {
              updateAddingItem("type", value)
              setPage(0)
            }}
          >
            <SelectTrigger className="w-auto border-none shadow-none bg-transparent p-0 font-normal text-sm text-muted-foreground hover:text-foreground focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reservation">Reservation</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent>
          </Select>
        </DrawerTitle>
        <DrawerDescription>{pages[page].title}</DrawerDescription>
      </DrawerHeader>
      <div className="p-4 pb-0">
        {pages[page].content}
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