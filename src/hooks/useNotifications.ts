import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface Notification {
  id: string
  type: "ABSENCE" | "COURSE_CHANGE" | "SCHEDULE_UPDATE"
  message: string
  read: boolean
  createdAt: string
}

export function useNotifications() {
  const queryClient = useQueryClient()

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch("/api/notifications")
      if (!response.ok) throw new Error("Erreur lors du chargement des notifications")
      return response.json()
    },
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  })

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
      })
      if (!response.ok) throw new Error("Erreur lors du marquage de la notification")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })

  return {
    notifications,
    isLoading,
    markAsRead,
    unreadCount: notifications.filter(n => !n.read).length,
  }
} 