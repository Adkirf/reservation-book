# Summary

## Description

Reservation Book is a web application designed to manage reservations efficiently. It provides a user-friendly interface for creating, viewing, and managing reservations, with features like calendar views, user management, and support.

## Tech Stack

- Next.js (React framework)
- TypeScript
- Firebase (Authentication and Firestore)
- Tailwind CSS
- Shadcn UI components

## Best Practices

- Component-based architecture
- Context API for state management
- Custom hooks for reusable logic
- Server-side rendering (SSR) with Next.js
- Progressive Web App (PWA) features
- Responsive design

## Key Functionalities

- User authentication (src/contexts/AuthProvider.tsx)
- Reservation management (src/contexts/ReservationProvider.tsx)
- Differentiated access to Reservations(only authenticated: Calendar, Reservations, Home & public: Confirmation)
- Admin panel (not implemented yet)
- Support & Tutorials (not implemented yet)

# Folder Structure

reservation-book/
├── public/
│   ├── assets/
│   ├── fonts/
│   └── sw.js
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── calendar/
│   │   ├── confirmation/
│   │   ├── login/
│   │   ├── offline/
│   │   ├── reservations/
│   │   ├── support/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── manifest.ts
│   │   ├── metadata.ts
│   │   ├── page.tsx
│   │   └── sw.ts
│   ├── components/
│   │   ├── Reservation/
│   │   ├── UserManagement/
│   │   ├── Calendar/
│   │   ├── Confirmation/
│   │   ├── FormInputs/
│   │   ├── ui/
│   │   ├── MenuSheet.tsx
│   ├── contexts/
│   │   ├── AuthProvider.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ReservationProvider.tsx
│   ├── hooks/
│   │   ├── useReservationFilter.ts
│   │   └── use-toast.ts
│   └── lib/
│       ├── firebase/
│       │   ├── auth.ts
│       │   ├── config.ts
│       │   └── firestore.ts
│       ├── settings/
│       ├── utils/
│       ├── projectTypes.ts




