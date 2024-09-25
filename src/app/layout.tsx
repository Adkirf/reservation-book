import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Menu, Plus } from "lucide-react";
import { MenuSheetComponent } from "@/components/MenuSheet";
import { MenuSidebar } from "@/components/MenuSheet";

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

export const metadata: Metadata = {
  title: "Reservation Book",
  description: "Reservation management app for small-to-medium gastronomy businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AuthProvider>
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

              <Button
                size="icon"
                className="fixed bottom-4 right-4 rounded-full shadow-lg"
                aria-label="Add item"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
