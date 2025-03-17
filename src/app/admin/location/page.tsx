"use client"

import { useState } from "react"
import { CreateLocation } from "@/components/location/CreateLocation"
import { AssignLocation } from "@/components/location/AssignLocation"
import { useRooms } from "@/hooks/useRooms"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function LocationManagementPage() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("")
  const { data: rooms, isLoading, error } = useRooms()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Erreur lors du chargement des salles
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Card className=" border-zinc-800">
          <CardHeader>
            <CardTitle className="text-center">Nouvelle localisation</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateLocation />
          </CardContent>
        </Card>

        {/* Section Assignation de localisation */}
        <Card className=" border-zinc-800">
          <CardHeader>
            <CardTitle>Assigner une localisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedRoomId}
              onValueChange={setSelectedRoomId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une salle" />
              </SelectTrigger>
              <SelectContent>
                {rooms?.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    <div className="flex justify-between items-center">
                      <span>{room.name}</span>
                      {room.location && (
                        <span className="text-sm ">
                          ({room.location.name})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedRoomId && <AssignLocation roomId={selectedRoomId} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}