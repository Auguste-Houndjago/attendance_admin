import { useQuery } from "@tanstack/react-query"

interface Room {
  id: string
  name: string
  locationId: string | null
  location?: {
    name: string
    address: string
  }
}

export function useRooms() {
  return useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await fetch("/api/rooms/location")
      if (!response.ok) throw new Error("Erreur lors du chargement des salles")
      return response.json()
    },
  })
}