'use client'

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PanelLeft, Package2, Home, Calendar, Book, HelpCircle, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthProvider"
import { signOut } from "@/lib/firebase/auth";

// Define menu items with their respective icons and routes
const menuItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/reservations", icon: Book, label: "All Reservations" },
  { href: "/support", icon: HelpCircle, label: "Support" },
]

// MenuContent component: Renders the content of the menu (used in both sheet and sidebar)
function MenuContent() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div className="flex flex-col h-full">
      <nav className="grid gap-6 text-lg font-medium">
        {/* Logo/Home link */}
        <Link
          href="/"
          className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
        >
          <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        {/* Render menu items */}
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-2.5 transition-colors",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
        {/* Conditionally render Admin link for admin users */}
        {user?.role === 'admin' && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-4 px-2.5 transition-colors",
              pathname === "/admin"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings className="h-5 w-5" />
            Admin
          </Link>
        )}
      </nav>
      {/* Sign out button at the bottom of the menu */}
      <div className="mt-auto pt-6">
        <Button onClick={signOut}>Sign Out</Button>;
      </div>
    </div>
  )
}

// MenuSheetComponent: Renders a slide-out sheet menu for mobile devices
export function MenuSheetComponent() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs flex flex-col">
        <MenuContent />
      </SheetContent>
    </Sheet>
  )
}

// MenuSidebar: Renders a fixed sidebar menu for larger screens
export function MenuSidebar() {
  return (
    <div className="hidden sm:flex sm:flex-col sm:w-64 sm:border-r sm:p-6 sm:h-screen">
      <MenuContent />
    </div>
  )
}