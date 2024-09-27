**Capabilities:**
1. User Authentication: The app supports Google Sign-In authentication using Firebase.
2. Role-based Access Control: Users are assigned roles (admin or employee) which determine their access to different parts of the app.
3. Reservation Management: The app allows viewing, adding, editing, and deleting reservations.
4. Task Management: Users can create and manage tasks alongside reservations.
5. User Management: Admins can view, add, and delete users.
6. Reservations and Tasks Page: Users can filter, search, and sort reservations and tasks based on various criteria.
7. Calendar View: Users can view reservations and tasks in different time periods (daily, weekly, monthly).

**User Flow:**
1. Login: Users authenticate via the login page using Google Sign-In.
2. Dashboard: After successful login, users are redirected to the dashboard.
3. Navigation: Users can access different sections of the app (Home, Calendar, Reservations, Support) via the sidebar or mobile menu.
4. Reservation and Task Management: Users can view, add, edit, and delete reservations and tasks.
5. Admin Functions: Admins have access to additional features like user management.

**General Structure:**
1. Next.js App Router: The app uses Next.js with the App Router for routing and page structure.

2. Context Providers: 
- AuthProvider: Manages authentication state and user roles.
- ReservationProvider: Manages reservation and task data and related operations.

3. Components:
- UI components: Reusable UI elements like buttons, cards, modals, and drawers.
- Reservation components: ReservationList, ReservationTable for managing reservations and tasks.
- UserManagement components: UserList for admin user management.
- Dashboard components: DailyView, WeeklyView, MonthlyView for calendar displays.
- MenuSheet and MenuSidebar for navigation.

4. Firebase Integration:
- Authentication: Handled in src/lib/firebase/auth.ts
- Firestore: Database operations in src/lib/firebase/firestore.ts

**Key Files and Their Purposes:**
- src/app/layout.tsx: Root layout component wrapping the entire app.
- src/contexts/AuthProvider.tsx: Manages authentication state.
- src/contexts/ReservationProvider.tsx: Manages reservation and task data.
- src/components/Reservation/: Contains components for reservation and task management.
- src/components/UserManagement/: Contains components for user management and login.
- src/components/Dashboard/: Contains components for different calendar views.
- src/lib/firebase/: Contains Firebase configuration and utility functions.
- src/hooks/useReservationFilter.ts: Custom hook for filtering, searching, and sorting reservations and tasks.

**Folder Structure**
reservation-book/
├── AI/
│   ├── documentation/
│   │   └── overview.md
│   ├── notes/
│   └── prompts/
│       └── update-overview.md
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
│   │   │   ├── AddItemForm.tsx
│   │   │   ├── AddItemIcon.tsx
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
│   │   │   ├── drawer.tsx
│   │   │   └── ... (other UI components)
│   │   ├── MenuSheet.tsx
│   │   └── MonthSelect.tsx
│   ├── contexts/
│   │   ├── AuthProvider.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ReservationProvider.tsx
│   ├── hooks/
│   │   └── useReservationFilter.ts
│   │   └── use-toast.ts
│   └── lib/
│       ├── firebase/
│       │   ├── auth.ts
│       │   ├── config.ts
│       │   └── firestore.ts
│       ├── projectTypes.ts
│       └── utils.ts



