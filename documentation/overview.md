# Overview SOP

This document outlines the steps required to create the MVP of the reservation management app for small-to-medium gastronomy businesses.

reservation-book/
├── public/
│   ├── fonts/
│   │   ├── GeistVF.woff
│   │   └── GeistMonoVF.woff
│   └── images/
│       └── logo.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── components/
│   │       ├── Dashboard/
│   │       │   ├── MonthlyView.tsx
│   │       │   ├── WeeklyView.tsx
│   │       │   └── DailyView.tsx
│   │       ├── Reservation/
│   │       │   ├── AddReservationForm.tsx
│   │       │   ├── EditReservationForm.tsx
│   │       │   └── ReservationModal.tsx
│   │       └── UserManagement/
│   │           ├── UserList.tsx
│   │           └── AddUserForm.tsx
│   ├── components/
│   │   └── AuthProvider.tsx
│   ├── lib/
│   │   ├── firebase.ts
│   │   └── auth.ts
│   ├── pages/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth].ts
│   │   ├── login.tsx
│   │   └── _app.tsx
│   └── styles/
│       └── tailwind.css
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── documentation/
    ├── overview.md
    ├── setup.md
    └── userflow.md

## Steps to Create MVP

- [x] **Setup**
  - [x] Initialize Next.js project
  - [x] Setup TypeScript
  - [x] Configure Tailwind CSS
  - [x] Setup Firebase Authentication

- [ ] **User Flow**
  - [x] Implement Firebase Authentication
  - [x] Create AuthProvider component
  - [ ] Create login page
  - [ ] Handle user roles (admin, employee)

- [ ] **Employee Flow**
  - [ ] Create dashboard view with monthly, weekly, and daily views
  - [ ] Prefill "add reservation form" based on current view
  - [ ] Implement "add reservation" functionality
  - [ ] Implement "edit reservation" functionality
  - [ ] Implement "delete reservation" functionality

-   [ ] **Admin Flow**
  - [ ] Create user management page
  - [ ] Implement "delete user" functionality
  - [ ] Implement "create user" functionality

- [ ] **UI Enhancements**
  - [ ] Apply consistent styling using Tailwind CSS
  - [ ] Ensure responsive design for all components
  - [ ] Implement dark mode toggle (if desired)

- [ ] **Error Handling and User Feedback**
  - [ ] Implement toast notifications for success/error messages
  - [ ] Add inline form validation feedback
  - [ ] Create error boundary components for graceful error handling

## Notes
- Focus on getting a working version of the app.
- Deployment and testing are not covered in this SOP.