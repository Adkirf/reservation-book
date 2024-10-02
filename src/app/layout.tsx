'use client'

import { useContext } from "react"; // Update this import
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import { MenuSheetComponent } from "@/components/MenuSheet";
import { MenuSidebar } from "@/components/MenuSheet";
import { AddItemIcon } from "@/components/Reservation/AddItemIcon";
import { AddItemForm } from "@/components/Reservation/AddItemForm";
import { ProtectedRoute } from '@/contexts/ProtectedRoute';
import { usePathname } from 'next/navigation';
import { ReservationProvider, useReservation } from '@/contexts/ReservationProvider'; // Update this import
import { Drawer } from "@/components/ui/drawer";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from 'next/navigation'; // Add this import

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
  const isLoginPage = pathname === '/login';
  const isConfirmationPage = pathname.startsWith('/confirmation/');

  return (
    <html lang="en">
      <head>
        {/* Add this meta tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <AuthProvider>
          {isLoginPage || isConfirmationPage ? (
            children
          ) : (
            <ProtectedRoute allowedRoles={['employee', 'admin']}>
              <ReservationProvider>
                <LayoutContent>{children}</LayoutContent>
              </ReservationProvider>
            </ProtectedRoute>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // Add this line

  return (
    <div className="flex flex-col flex-grow sm:flex-row bg-background text-foreground">
      <MenuSidebar />
      <div className="h-screen flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 bg-background border-b sm:hidden">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <MenuSheetComponent />
            <h1 className="text-lg font-semibold ml-4">My App</h1>
          </div>
        </header>

        <main className="flex flex-col flex-grow overflow-hidden">
          {children}
        </main>

        <AddItemIcon />
        <Toaster />
      </div>
    </div>
  );
}
