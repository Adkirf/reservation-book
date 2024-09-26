
1. Required Files: 
- ReservationProvider.tsx
- useReservationFilters.tsx
- ReservationList.tsx
- ReservationTable.tsx
- MonthSelect.tsx
- ColumnVisibilityDropdown.tsx
- SearchBar.tsx
- firestore.ts
- projectTypes.ts
- utils.ts

2. New files to be created:

src/hooks/useReservationFilters.tsx
- Implement a custom hook for managing filters and sorting logic

src/lib/utils/sortAndFilterDbItems.ts
- Create utility functions for sorting and filtering dbItems
- Add function to filter and display dbItems by type (all, reservations, tasks)
- Add logic to filter and display dbItems by column (name, date, number of people)
- Add function to filter and display dbItems by name 

3. Existing files to be modified:
src/app/reservations/page.tsx
- Update to include ReservationList.tsx, MonthSelect.tsx 

src/contexts/ReservationProvider.tsx
- Update context to provide necessary state and functions to child components

src/components/Reservation/ReservationList.tsx
- Update to include ReservationTable.tsx, ColumnVisibilityDropdown.tsx, and SearchBar.tsx

src/components/Reservation/ReservationTable.tsx
- Update to include ColumnVisibilityDropdown.tsx, and SearchBar.tsx  

src/components/ColumnVisibilityDropdown.tsx
- Update to use ReservationProvider.tsx and useReservationFilters.tsx

src/components/SearchBar.tsx
- Update to use ReservationProvider.tsx and useReservationFilters.tsx

src/components/MonthSelect.tsx
- Update to use ReservationProvider.tsx and useReservationFilters.tsx   


