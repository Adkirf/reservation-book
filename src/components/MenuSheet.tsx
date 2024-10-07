'use client'

import { useState } from "react"; // Add this import
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet"
import { PanelLeft, Home, Calendar, Book, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation' // Add useRouter
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthProvider"
import { signOut } from "@/lib/firebase/auth";

// Define menu items with their respective icons and routes
const menuItems = [
  { href: "/", icon: Home, label: "menuSheet.home" },
  { href: "/calendar", icon: Calendar, label: "menuSheet.calendar" },
  { href: "/reservations", icon: Book, label: "menuSheet.allReservations" },
  { href: "/support", icon: HelpCircle, label: "menuSheet.support" },
]

// Update MenuContent to accept and use onItemClick prop
function MenuContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()
  const { user, t } = useAuth()
  const router = useRouter() // Add this

  const handleItemClick = (href: string) => {
    router.push(href) // Navigate to the new page
    if (onItemClick) onItemClick() // Close the sheet if on mobile
  }

  return (
    <div className="flex flex-col h-full">
      <nav className="grid gap-6 text-lg font-medium pt-12">

        {menuItems.map((item) => (
          <button
            key={item.href}
            onClick={() => handleItemClick(item.href)}
            className={cn(
              "flex items-center gap-4 px-2.5 transition-colors text-left",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {t(item.label)}
          </button>
        ))}
        {/* Remove the Admin link */}
      </nav>
      <div className="mt-auto pt-6">
        <Button onClick={signOut}>{t('menuSheet.signOut')}</Button>
      </div>
    </div>
  )
}

// Update MenuSheetComponent to handle sheet open state
export function MenuSheetComponent() {
  const [open, setOpen] = useState(false)
  const { t } = useAuth()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">{t('menuSheet.toggleMenu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs flex flex-col">
        <SheetTitle className="hidden">
          {t('menuSheet.menu')}
        </SheetTitle>
        <MenuContent onItemClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

// MenuSidebar remains unchanged
export function MenuSidebar() {
  return (
    <div className="hidden sm:flex sm:flex-col sm:w-64 sm:border-r sm:p-6 sm:h-screen">
      <MenuContent />
    </div>
  )
}