This Next.js application is a reservation management system for small-to-medium gastronomy businesses, featuring user authentication and role-based access control. The app utilizes Firebase for backend services, including authentication and Firestore database, with a frontend built using TypeScript and styled with Tailwind CSS. It offers a dashboard with various reservation views (monthly, weekly, daily) for employees, and additional user management capabilities for admins. The project structure follows Next.js conventions, incorporates custom fonts, and is set up for easy deployment, likely on Vercel.

**Folder Structure**

reservation-book/
├── public/
│   └── fonts/
│       ├── GeistVF.woff
│       └── GeistMonoVF.woff
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── DailyView.tsx
│   │   │   ├── MonthlyView.tsx
│   │   │   └── WeeklyView.tsx
│   │   ├── Reservation/
│   │   │   ├── AddReservationForm.tsx
│   │   │   ├── EditReservationForm.tsx
│   │   │   └── ReservationModal.tsx
│   │   ├── UserManagement/
│   │   │   ├── AddUserForm.tsx
│   │   │   └── UserList.tsx
│   │   ├── AuthProvider.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ReservationContext.tsx
│   └── lib/
│       ├── firebase/
│       │   ├── auth.ts
│       │   ├── config.ts
│       │   └── firestore.ts
│       └── types.ts
├── .env
├── .gitignore
├── firestore.rules
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── documentation/
    ├── adminflow.md
    ├── employeeflow.md
    ├── overview.md
    ├── setup.md
    └── userflow.md

