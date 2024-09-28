import React, { useState, useEffect } from 'react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Reservation, Task, dbItem } from '@/lib/projectTypes'
import { useReservation } from '@/contexts/ReservationProvider';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DayRangePicker from '@/components/DayRangePicker';
import { HourRangePickerComponent as HourRangePicker } from '@/components/HourRangePicker';
import { DateRange } from "react-day-picker";


interface EditItemPopoverProps {
    item: dbItem;
    initialColumn: string;
}

type EditableKey = keyof dbItem | 'date' | keyof Task | keyof Reservation;


export function EditItemPopover({ item, initialColumn }: EditItemPopoverProps) {
    const { editingItem, setEditingItem, updateEditingItem, saveEditingItem } = useReservation();
    const [itemKeys, setItemKeys] = useState<(keyof dbItem)[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        let keys = Object.keys(item) as (keyof dbItem)[];
        if (keys.includes('dateStart') && keys.includes('dateEnd')) {
            keys = keys.filter(key => key !== 'dateStart' && key !== 'dateEnd');
            keys.push('date' as keyof dbItem);
        }
        setItemKeys(keys);
        const initialIndex = keys.indexOf(initialColumn as keyof dbItem);
        setCurrentIndex(initialIndex !== -1 ? initialIndex : 0);
    }, [popoverOpen]);

    useEffect(() => {
        if (popoverOpen && itemKeys.length > 0) {
            const currentKey = itemKeys[currentIndex];
            setDisplayValue(getDisplayValue(currentKey));
        }
    }, [currentIndex, popoverOpen, item, itemKeys]);

    const handleEdit = (value: string) => {
        const currentKey = itemKeys[currentIndex];
        setDisplayValue(value);
        if (editingItem?.id === item.id) {
            updateEditingItem(currentKey, value);
        } else {
            setEditingItem({ ...item, [currentKey]: value });
        }
    };

    const handleSave = async () => {
        await saveEditingItem();
        setPopoverOpen(false);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : itemKeys.length - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev < itemKeys.length - 1 ? prev + 1 : 0));
    };

    const handleDateRangeChange = (dateRange: DateRange | undefined) => {
        if (dateRange?.from && dateRange?.to) {
            updateEditingItem('dateStart', dateRange.from);
            updateEditingItem('dateEnd', dateRange.to);
        }
    };

    const handleHourRangeChange = ([start, end]: [Date, Date]) => {
        updateEditingItem('dateStart', start);
        updateEditingItem('dateEnd', end);
    };

    const currentKey = itemKeys[currentIndex];


    const renderEditComponent = (key: EditableKey) => {
        const value = getDisplayValue(key);

        switch (key) {
            case 'name':
                return (
                    <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleEdit(e.target.value)}
                    />
                );
            case 'date':
                return (
                    <div>
                        <DayRangePicker
                            currentDateRange={[item.dateStart, item.dateEnd]}
                            onDateRangeChange={handleDateRangeChange}
                        />
                        <HourRangePicker
                            currentHourRange={[item.dateStart, item.dateEnd]}
                            onHourRangeChange={handleHourRangeChange}
                        />
                    </div>
                );

            case 'comment':
                return (
                    <textarea
                        className="w-full p-2 border rounded"
                        value={value}
                        onChange={(e) => handleEdit(e.target.value)}
                    />
                );
            case 'numberOfPeople':
                return (
                    <Input
                        type="number"
                        value={value}
                        onChange={(e) => handleEdit(e.target.value)}
                    />
                );
            case 'assignedTo':
                return (
                    <Select onValueChange={handleEdit} defaultValue={value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user1">User 1</SelectItem>
                            <SelectItem value="user2">User 2</SelectItem>
                        </SelectContent>
                    </Select>
                );

            default:
                return (
                    <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleEdit(e.target.value)}
                    />
                );
        }
    };

    const getDisplayValue = (key: EditableKey) => {
        if (key === 'date') {
            const formatDate = (date: Date) => {
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                return `${day}.${month}`;
            };
            return `${formatDate(item.dateStart)} - ${formatDate(item.dateEnd)}`;
        }
        return (item as any)[key]?.toString() || '';
    };

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    {getDisplayValue(initialColumn as EditableKey)}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Button onClick={goToPrevious} variant="ghost" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                        <h4 className="font-medium">Edit {currentKey}</h4>
                        <Button onClick={goToNext} variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                    <div className="h-24 flex items-center">
                        {renderEditComponent(currentKey as EditableKey)}
                    </div>
                    <Button onClick={handleSave} className="w-full">Save</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}