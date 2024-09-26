import { Months } from "@/lib/projectTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useReservation } from "@/contexts/ReservationProvider";
import { useReservationFilters } from "@/hooks/useReservationFilter";

export default function MonthSelect() {
    const { currentMonth, currentYear, setCurrentMonth, setCurrentYear } = useReservation();
    const { updateFilters } = useReservationFilters([]);

    // Handler for month selection change
    const handleMonthChange = (value: string) => {
        const [year, month] = value.split('-');
        setCurrentMonth(Months[parseInt(month)]);
        setCurrentYear(parseInt(year));
        updateFilters();
    };

    // Generate options for the month selector
    // This function creates a list of the next 6 months from the current date
    const generateMonthOptions = () => {
        const options = [];
        const currentDate = new Date();
        for (let i = 0; i < 6; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
            const value = `${date.getFullYear()}-${date.getMonth()}`;
            const label = Months[date.getMonth()];
            options.push(<SelectItem key={value} value={value}>{label}</SelectItem>);
        }
        return options;
    };

    return (
        <Select
            value={`${currentYear}-${Months.indexOf(currentMonth)}`}
            onValueChange={handleMonthChange}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={currentMonth}>
                    {currentMonth}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {generateMonthOptions()}
            </SelectContent>
        </Select>
    )
}