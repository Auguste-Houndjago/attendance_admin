"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Location {
  id: string
  name: string
  address: string
}

interface Room {
  id: string
  name: string
  locationId: string | null
  location?: {
    name: string
    address: string
  }
}

interface AssignLocationProps {
  roomId: string
}

export function AssignLocation({ roomId }: AssignLocationProps) {
  const queryClient = useQueryClient()

  // Utiliser les données du cache si disponibles
  const room = queryClient.getQueryData<Room[]>(["rooms"])?.find(r => r.id === roomId)

  const { data: locations, isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await fetch("/api/locations")
      if (!response.ok) throw new Error("Erreur lors du chargement des localisations")
      return response.json()
    },
    staleTime: 30000, // Cache valide pendant 30 secondes
  })

  const assignLocation = useMutation({
    mutationFn: async (locationId: string) => {
      const response = await fetch(`/api/rooms/${roomId}/location`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId }),
      })
      if (!response.ok) throw new Error("Erreur lors de l'assignation")
      return response.json()
    },
    onSuccess: (updatedRoom) => {
      // Mise à jour optimiste du cache
      queryClient.setQueryData<Room[]>(["rooms"], (old) => 
        old?.map(room => room.id === roomId ? updatedRoom : room)
      )
      toast.success("Localisation assignée avec succès")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue")
    },
  })

  if (locationsLoading || !room) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-zinc-400 mb-2">
        Localisation actuelle : {room.location?.name || "Aucune"}
      </div>

      <Select
        value={room.locationId || ""}
        onValueChange={(value) => assignLocation.mutate(value)}
        disabled={assignLocation.isPending}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner une localisation" />
        </SelectTrigger>
        <SelectContent>
          {locations?.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              {location.name} - {location.address}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {room.locationId && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => assignLocation.mutate("")}
          disabled={assignLocation.isPending}
        >
          Retirer la localisation
        </Button>
      )}
    </div>
  )
} 