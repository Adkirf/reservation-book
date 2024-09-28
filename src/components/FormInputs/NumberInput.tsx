'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface NumberInputProps {
  currentNumber: number;
  onNumberChange: (value: number) => void;
}

export function NumberInput({ currentNumber, onNumberChange }: NumberInputProps) {
  const [value, setValue] = useState(currentNumber)

  useEffect(() => {
    setValue(currentNumber)
  }, [currentNumber])

  const increment = () => {
    const newValue = value + 1
    setValue(newValue)
    onNumberChange(newValue)
  }

  const decrement = () => {
    const newValue = Math.max(0, value - 1)
    setValue(newValue)
    onNumberChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    if (!isNaN(newValue)) {
      setValue(newValue)
      onNumberChange(newValue)
    }
  }

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        onClick={decrement}
        className="rounded-r-none"
        aria-label="Decrease value"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        className="rounded-none text-center w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Number input"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={increment}
        className="rounded-l-none"
        aria-label="Increase value"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}