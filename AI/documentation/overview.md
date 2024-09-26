**Capabilities:**
1. User Authentication: The app supports Google Sign-In and email/password authentication using Firebase.
2. Role-based Access Control: Users are assigned roles (admin or employee) which determine their access to different parts of the app.
3. Reservation Management: The app allows viewing, adding, editing, and deleting reservations.
4. User Management: Admins can view, add, and delete users.
5. reservations page: Users can filter and search reservations based on various criteria.

**User Flow:**
1. Login: Users authenticate via the login page using Google Sign-In or email/password.
2. Dashboard: After successful login, users are redirected to the dashboard.
3. Navigation: Users can access different sections of the app (Home, Calendar, Reservations, Support) via the sidebar or mobile menu.
4. Reservation Management: Users can view reservations in different time periods (week, month, year) and perform CRUD operations on reservations.
5. Admin Functions: Admins have access to additional features like user management.

**General Structure:**
1. Next.js App Router: The app uses Next.js with the App Router for routing and page structure.

2. Context Providers: 
- AuthProvider: Manages authentication state and user roles.
- ReservationProvider: Manages reservation data and related operations.

3. Components:
- UI components: Reusable UI elements like buttons, cards, and modals.
- Reservation components: ReservationList, ReservationTable, ReservationEdit for managing reservations.
- UserManagement components: UserList for admin user management.
- MenuSheet and MenuSidebar for navigation.

3. Firebase Integration:
- Authentication: Handled in src/lib/firebase/auth.ts
- Firestore: Database operations in src/lib/firebase/firestore.ts

**Key Files and Their Purposes:**
- src/app/layout.tsx: Root layout component wrapping the entire app.
- src/contexts/AuthProvider.tsx: Manages authentication state.
- src/contexts/ReservationProvider.tsx: Manages reservation data.
- src/components/Reservation/: Contains components for reservation management.
- src/components/UserManagement/: Contains components for user management.
- src/components/Dashboard/: Contains components for different calendar views.
- src/lib/firebase/: Contains Firebase configuration and utility functions.
- src/hooks/useReservationFilter.ts: Custom hook for filtering and searching reservations.

**Folder Structure**
reservation-book/
├── AI/
│   ├── documentation/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── calendar/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── reservations/
│   │   │   └── page.tsx
│   │   ├── support/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── metadata.ts
│   │   └── page.tsx
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── DailyView.tsx
│   │   │   ├── MonthlyView.tsx
│   │   │   └── WeeklyView.tsx
│   │   ├── Reservation/
│   │   │   ├── AddReservationButton.tsx
│   │   │   ├── AddReservationForm.tsx
│   │   │   ├── ReservationEdit.tsx
│   │   │   ├── ReservationList.tsx
│   │   │   └── ReservationTable.tsx
│   │   ├── UserManagement/
│   │   │   ├── AddUserForm.tsx
│   │   │   ├── Login.tsx
│   │   │   └── UserList.tsx
│   │   ├── ui/
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── tabs.tsx
│   │   ├── ColumnVisibilityDropdown.tsx
│   │   ├── MenuSheet.tsx
│   │   ├── MonthSelect.tsx
│   │   └── SearchBar.tsx
│   ├── contexts/
│   │   ├── AuthProvider.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ReservationProvider.tsx
│   ├── hooks/
│   │   └── useReservationFilter.ts
│   └── lib/
│       ├── firebase/
│       │   ├── auth.ts
│       │   ├── config.ts
│       │   └── firestore.ts
│       ├── projectTypes.ts
│       └── utils.ts



