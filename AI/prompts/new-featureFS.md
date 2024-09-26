Please review the current project thoroughly and give me a folder structure of all files that are affected by the new feature. Do NOT implement any code - focus purely on identifiyng all necessary exisitng or new files. 

The new feature is: 
- Implement the reservation page, which allows users to view and sort all dbItems in a table. 
- The reservation page includes a Select component to fetch and display all dbItems for a specific month
- The reservation page includes a ReservationList component, that displays the current dbItems
- The ReservationList component has a "All", "Reservations", "Tasks" tablist, which sort the dbItems by type. 
- The ReservationList component has a dropdown menu to toggle the visibility of columns based on the currently selected tab. 
- The ReservationList component has a searchbar to filter the dbItems by name. 
- All fetched to the database go through the firestore.ts file, where firebase's build-in caching and offline support is used. 
- All changes to the dbItems are also added to the ReservationContext, to synchronize the apps global state


