"use client"

import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/hooks/useNotifications"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, isLoading } = useNotifications()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-zinc-500">
            Aucune notification
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`p-4 ${!notification.read ? "bg-zinc-800/50" : ""}`}
              onClick={() => markAsRead.mutate(notification.id)}
            >
              <div className="space-y-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-zinc-500">
                  {format(new Date(notification.createdAt), "PPp", { locale: fr })}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 