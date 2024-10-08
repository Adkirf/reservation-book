"use client"

import { useState, useEffect, useRef, ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
// or
import { useToast } from "@/hooks/use-toast"
import { Copy, Mail, MessageCircle, MessageSquare, Share2 } from "lucide-react"

interface ShareComponentProps {
  children: ReactNode;
  reservationId: string;
}

export function ShareComponent({ children, reservationId }: ShareComponentProps) {
  const [isClient, setIsClient] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsClient(true)
    const baseUrl = window.location.origin
    const url = `${baseUrl}/confirmation/${reservationId}`
    setCurrentUrl(url)
    setShortUrl(`${baseUrl}/...`)
  }, [reservationId])

  const handleShare = (method: string) => {
    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(currentUrl)}`, '_blank')
        break
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(currentUrl)}`, '_blank')
        break
      case 'email':
        window.open(`mailto:?body=${encodeURIComponent(currentUrl)}`, '_blank')
        break
    }
  }

  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      toast({
        title: "Link copied",
        description: "The reservation link has been copied to your clipboard.",
      })
    } catch (err) {
      console.error('Failed to copy: ', err)
      toast({
        title: "Copy failed",
        description: "Unable to copy the link. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isClient) return null

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle>Share this reservation</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col items-center space-y-6 p-4">
          <div className="flex justify-center gap-4 w-full">
            <div className="flex flex-col items-center space-y-2">
              <Button
                onClick={() => handleShare('whatsapp')}
                variant="outline"
                size="icon"
                className="rounded-full border-2"
              >
                <MessageSquare className="h-4 w-4 text-gray-700" />
                <span className="sr-only">Share on WhatsApp</span>
              </Button>
              <span className="text-sm text-gray-700">WhatsApp </span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Button
                onClick={() => handleShare('sms')}
                variant="outline"
                size="icon"
                className="rounded-full border-2"
              >
                <MessageCircle className="h-4 w-4 text-gray-700" />
                <span className="sr-only">Share via SMS</span>
              </Button>
              <span className="text-sm text-gray-700 whitespace-pre">   SMS   </span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Button
                onClick={() => handleShare('email')}
                variant="outline"
                size="icon"
                className="rounded-full border-2"
              >
                <Mail className="h-4 w-4 text-gray-700" />
                <span className="sr-only">Share via Email</span>
              </Button>
              <span className="text-sm text-gray-700 whitespace-pre">  MAIL  </span>
            </div>
          </div>
          <div
            className="flex items-center justify-between w-full max-w-md px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded-md cursor-pointer"
            onClick={handleCopy}
          >
            <span className="flex-grow truncate">{shortUrl}</span>
            <Copy className="h-4 w-4 flex-shrink-0 text-gray-700" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}