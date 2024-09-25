This Next.js application is a reservation management system for small-to-medium gastronomy businesses, featuring user authentication and role-based access control. The app utilizes Firebase for backend services, including authentication and Firestore database, with a frontend built using TypeScript and styled with Tailwind CSS. It offers a dashboard with various reservation views (monthly, weekly, daily) for employees, and additional user management capabilities for admins. The project structure follows Next.js conventions, incorporates custom fonts, and is set up for easy deployment, likely on Vercel.

**Folder Structure**

reservation-book/
├── public/
│   └── fonts/
│       ├── GeistVF.woff
│       └── GeistMonoVF.woff
├── src/
│   ├── app/
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
│   │   └── AuthProvider.tsx
│   └── lib/
│       ├── firebase/
│       │   ├── config.ts
│       │   └── auth.ts
│       └── projectTypes.ts
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
    ├── overview.md
    ├── setup.md
    ├── userflow.md
    ├── employeeflow.md
    └── adminflow.md

