'use client'

import { useContext, useState, useEffect } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider, useAuth } from "@/contexts/AuthProvider";
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
function PWAInstallInstructions() {
  const { t } = useAuth();
  return (
    <div className="w-full h-full bg-gray-200 fixed inset-0 overflow-y-auto">
      <div className="min-h-full p-4 flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4 w-full max-w-[500px] items-center">
          <div className="w-[100px] h-[100px]">
            <img className="rounded-xl" src="/assets/icon-512x512.png" alt="App Icon" />
          </div>
          <h3 className="text-xl font-bold text-gray-700">
            {t('layout.addToHomeScreenTitle')}
          </h3>
          <p>{t('layout.addToHomeScreenDescription')}</p>

          <div className="border border-gray-400 rounded-xl p-4 mt-8">
            <p>{t('layout.shareButton')}</p>
            <img src="/assets/share.png" alt="Share Button" />
          </div>
          <div className="border border-gray-400 rounded-xl p-4">
            <p>{t('layout.addHomeScreenButton')}</p>
            <img src="/assets/addtohomescreen.png" alt="Add to Home Screen Button" />
          </div>
        </div>
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

    // Check if the app is installed and if it's a touch screen device
    const checkInstallation = () => {
      const isTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsAppInstalled(true);
      } else {
        setShowInstallInstructions(false); //turn on and off
        setIsAppInstalled(false);
      }
    };

    // Wait a bit before checking to ensure the DOM is fully loaded
    const timer = setTimeout(checkInstallation, 1000);

    return () => clearTimeout(timer);
  }, []);

  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isConfirmationPage = pathname.startsWith('/confirmation/');

  const intialRedirect = (children: React.ReactNode) => {
    if (isConfirmationPage) {
      return children;
    }
    else if (showInstallInstructions && !isAppInstalled) {
      return <PWAInstallInstructions />
    }
    else if (isLoginPage) {
      return children;
    } else {
      return (
        <ProtectedRoute allowedRoles={['employee', 'admin']}>
          <ReservationProvider>
            <LayoutContent>{children}</LayoutContent>
          </ReservationProvider>
        </ProtectedRoute>
      )
    }
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen fixed items-center`}
      >
        <AuthProvider>
          {intialRedirect(children)}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "menuSheet.home" },
    { href: "/calendar", label: "menuSheet.calendar" },
    { href: "/reservations", label: "menuSheet.allReservations" },
    { href: "/support", label: "menuSheet.support" },
  ]

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.href === pathname);
    if (currentItem) {
      return t(currentItem.label);
    }
    return t('layout.appName'); // Fallback to app name if no match found
  }

  return (
    <div className="flex flex-col flex-grow sm:flex-row bg-background text-foreground">
      <MenuSidebar />
      <div className="h-screen flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 bg-background border-b sm:hidden">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <MenuSheetComponent />
            <h1 className="text-lg font-semibold ml-4">{getPageTitle()}</h1>
          </div>
        </header>

        <main className="flex flex-col flex-grow overflow-hidden p-4">
          {children}
        </main>

        <AddItemIcon />
      </div>
    </div>
  );
}
