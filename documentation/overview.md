# Overview SOP

This document outlines the steps required to create the MVP of the reservation management app for small-to-medium gastronomy businesses.

reservation-book/
├── public/
│   └── fonts/
│       ├── GeistVF.woff
│       └── GeistMonoVF.woff
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth].ts
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── MonthlyView.tsx
│   │   │   ├── WeeklyView.tsx
│   │   │   └── DailyView.tsx
│   ├── lib/
│   │   ├── firebase.ts
│   │   └── projectTypes.ts
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── documentation/
    ├── overview.md
    ├── setup.md
    ├── userflow.md
    ├── employeeflow.md
    └── adminflow.md

## Steps to Create MVP

- [x] **Setup**
  - [x] Initialize Next.js project with App Router
  - [x] Setup TypeScript
  - [x] Configure Tailwind CSS
  - [x] Setup Firebase Authentication

- [ ] **User Flow**
  - [x] Implement Firebase Authentication
  - [x] Create AuthProvider component
  - [ ] Create login page (app/login/page.tsx)
  - [ ] Handle user roles (admin, employee)

- [ ] **Employee Flow**
  - [ ] Create dashboard page with view selection (monthly, weekly, daily)
  - [ ] Implement MonthlyView component
  - [ ] Implement WeeklyView component
  - [ ] Implement DailyView component
  - [ ] Add state management for switching between views

-   [ ] **Admin Flow**
  - [ ] Create user management page (app/admin/page.tsx)
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

- [ ] **API Development**
  - [ ] Implement authentication API routes
  - [ ] Create reservation management API routes
  - [ ] Develop user management API routes

## Notes
- Focus on getting a working version of the app.
- Deployment and testing are not covered in this SOP.