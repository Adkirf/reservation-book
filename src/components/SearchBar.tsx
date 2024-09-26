import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useReservation } from "@/contexts/ReservationProvider";
import { useReservationFilters } from "@/hooks/useReservationFilter";

export default function SearchBar() {
    const { items } = useReservation();
    const { searchQuery, setSearchQuery, updateFilters } = useReservationFilters(items);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        updateFilters();
    };

    return (
        <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Search by name, date, or number"
                className="pl-8 w-[300px]"
                value={searchQuery}
                onChange={handleSearchChange}
            />
        </div>
    );
}