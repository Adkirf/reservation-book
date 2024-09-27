1. add item form
 - Each page correspdonds to a field of the "adding item" state object variable in the ReservationProvider
 - Includes a small Select field to change type betweem "Reservation" or "Task"
 - Form pages and input fields are conditionally rendered based on the type selected
 - The last step closes the "AddItemForm" and populates the ReservationProvider "currentItem" state variable, if all requried fields are valid

 

2. reservation edit
- see/edit all information in ona modal
- Save button
- Delelte and Close Icon at the top 
- Current reservation state only updated by selecting a new item, 
