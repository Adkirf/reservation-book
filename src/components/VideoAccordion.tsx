"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

interface Video {
  title: string;
  videoSrc: string;
  description: string;
}

interface VideoAccordionComponentProps {
  videos: Video[];
}

export function VideoAccordionComponent({ videos }: VideoAccordionComponentProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full max-w-3xl mx-auto"
      onValueChange={(value) => setOpenItem(value)}
    >
      {videos.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <video
                autoPlay
                muted
                playsInline
                loop
                className="w-full rounded-md shadow-md"
                poster={item.videoSrc.replace('.mp4', '-poster.jpg')}
                key={openItem === `item-${index}` ? 'playing' : 'paused'}
              >
                <source src={item.videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}