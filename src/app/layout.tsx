'use client'

import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import { MenuSheetComponent } from "@/components/MenuSheet";
import { MenuSidebar } from "@/components/MenuSheet";
import { AddReservationButton } from "@/components/Reservation/AddReservationButton"
import { ProtectedRoute } from '@/contexts/ProtectedRoute';
import { usePathname } from 'next/navigation';
import { ReservationProvider } from '@/contexts/ReservationProvider';

// Load custom fonts for the application
const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Root layout component that wraps the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  // Check if the current page is the login page
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        {/* Wrap the entire app with AuthProvider for authentication context */}
        <AuthProvider>
          {isLoginPage ? (
            // Render children directly for the login page
            children
          ) : (
            // Wrap other pages with ProtectedRoute component
            <ProtectedRoute allowedRoles={['employee', 'admin']}>
              <ReservationProvider>
                <div className="min-h-full flex flex-col sm:flex-row bg-background text-foreground">
                  {/* Sidebar menu for larger screens */}
                  <MenuSidebar />
                  <div className="flex-grow flex flex-col">
                    {/* Header with hamburger menu for small screens */}
                    <header className="sticky top-0 z-10 bg-background border-b sm:hidden">
                      <div className="container mx-auto px-4 h-16 flex items-center">
                        <MenuSheetComponent />
                        <h1 className="text-lg font-semibold ml-4">My App</h1>
                      </div>
                    </header>

                    {/* Main content area */}
                    <main className="flex-grow flex items-center justify-center">
                      {children}
                    </main>

                    {/* Add the new AddReservationButton component here */}
                    <AddReservationButton />
                  </div>
                </div>
              </ReservationProvider>
            </ProtectedRoute>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
