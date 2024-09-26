import React from 'react';

interface MonthSelectorProps {
    selectedMonth: string;
    onMonthChange: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedMonth, onMonthChange }) => {
    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onMonthChange(event.target.value);
    };

    const generateMonthOptions = () => {
        const options = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        for (let i = 0; i < 12; i++) {
            const date = new Date(currentYear, currentMonth - i, 1);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            options.push(
                <option key={value} value={value}>
                    {label}
                </option>
            );
        }

        return options;
    };

    return (
        <select
            className="mb-4 p-2 border rounded"
            value={selectedMonth}
            onChange={handleMonthChange}
        >
            {generateMonthOptions()}
        </select>
    );
};

export default MonthSelector;