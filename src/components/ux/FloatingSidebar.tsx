"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronUp,MapPinHouse ,Calendar , Home, Menu, MessageSquare, Settings, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FloatingSidebarProps {
  className?: string
}

const sidebarItems = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: User, label: "Cours", href: "/admin/course" },
  { icon: Calendar , label: "Planning", href: "/admin/schedule" },
  { icon: MessageSquare, label: "Messages", href: "#" },
  { icon: MapPinHouse , label: "location", href: "/admin/location" },
  { icon: Settings, label: "Paramètres", href: "/admin/parametres" }
]

export function FloatingSidebar({ className }: FloatingSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={cn("fixed bottom-16 left-4 z-50", className)}>
      <TooltipProvider delayDuration={300}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 28 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 28 }}
              transition={{ duration: 0.4 }}
              className="mb-32 flex w-12 flex-col gap-2 overflow-hidden rounded-lg bg-primary shadow-lg"
              style={{ position: "absolute", bottom: "100%", left: 0 }}
            >
              {sidebarItems.map((item, index) => (
                <SidebarItem key={index} icon={item.icon} label={item.label} href={item.href} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <Button size="icon" className="h-12 w-12 rounded-full shadow-lg" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronUp className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </TooltipProvider>
    </div>
  )
}

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  href: string
}

function SidebarItem({ icon: Icon, label, href }: SidebarItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href}>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-none text-primary-foreground hover:bg-primary/80"
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>  
  )
}
