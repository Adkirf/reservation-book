'use client'

import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import { MenuSheetComponent } from "@/components/MenuSheet";
import { MenuSidebar } from "@/components/MenuSheet";
import { AddReservationButton } from "@/components/AddReservationButton";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { usePathname } from 'next/navigation';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AuthProvider>
          {isLoginPage ? (
            children
          ) : (
            <ProtectedRoute allowedRoles={['employee', 'admin']}>
              <div className="min-h-full flex flex-col sm:flex-row bg-background text-foreground">
                <MenuSidebar />
                <div className="flex-grow flex flex-col">
                  <header className="sticky top-0 z-10 bg-background border-b sm:hidden">
                    <div className="container mx-auto px-4 h-16 flex items-center">
                      <MenuSheetComponent />
                      <h1 className="text-lg font-semibold ml-4">My App</h1>
                    </div>
                  </header>

                  <main className="flex-grow flex items-center justify-center">
                    {children}
                  </main>

                  <AddReservationButton />
                </div>
              </div>
            </ProtectedRoute>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
