'use client'

import { useContext, useState, useEffect } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import { MenuSheetComponent } from "@/components/MenuSheet";
import { MenuSidebar } from "@/components/MenuSheet";
import { AddItemIcon } from "@/components/Reservation/AddItemIcon";
import { AddItemForm } from "@/components/Reservation/AddItemForm";
import { ProtectedRoute } from '@/contexts/ProtectedRoute';
import { usePathname } from 'next/navigation';
import { ReservationProvider, useReservation } from '@/contexts/ReservationProvider';
import { Drawer } from "@/components/ui/drawer";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from 'next/navigation';

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

// PWA Installation Instructions Component
function PWAInstallInstructions({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm">
        <h2 className="text-xl font-bold mb-4">Install Our App</h2>
        <p className="mb-4">For the best experience, install our app on your home screen:</p>
        <ol className="list-decimal list-inside mb-4">
          <li>Tap the share button in your browser</li>
          <li>Select "Add to Home Screen"</li>
          <li>Tap "Add" to confirm</li>
        </ol>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

// Root layout component that wraps the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        function (registration) {
          console.log('Service worker registration succeeded:', registration);
        },
        function (error) {
          console.log('Service worker registration failed:', error);
        }
      );
    }

    // Check if the app is installed
    const checkInstallation = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsAppInstalled(true);
      } else {
        setShowInstallInstructions(true);
      }
    };

    // Wait a bit before checking to ensure the DOM is fully loaded
    const timer = setTimeout(checkInstallation, 1000);

    return () => clearTimeout(timer);
  }, []);

  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isConfirmationPage = pathname.startsWith('/confirmation/');

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        {showInstallInstructions && !isAppInstalled && (
          <PWAInstallInstructions onClose={() => setShowInstallInstructions(false)} />
        )}
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
  const router = useRouter();

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
