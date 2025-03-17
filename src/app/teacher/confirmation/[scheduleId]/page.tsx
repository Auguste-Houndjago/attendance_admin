"use client"

import { useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Clock, MapPin, User, Loader2, Check, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGeolocation } from "@/hooks/useGeolocation"
import { toast } from "sonner"
import { AttendanceSchedule } from "@/types/types"




const getStatusStyle = (status: "PRESENT" | "ABSENT" | "LATE") => {
  switch (status) {
    case "PRESENT":
      return "bg-emerald-500/10 text-emerald-500"
    case "LATE":
      return "bg-yellow-500/10 text-yellow-500"
    case "ABSENT":
      return "bg-red-500/10 text-red-500"
    default:
      return "bg-zinc-500/10 text-zinc-500"
  }
}

// Ajout d'une fonction pour traduire le statut
const getStatusLabel = (status: "PRESENT" | "ABSENT" | "LATE") => {
  switch (status) {
    case "PRESENT":
      return "Présent"
    case "LATE":
      return "En retard"
    case "ABSENT":
      return "Absent"
    default:
      return status
  }
}

export default function ConfirmationPage() {
  const params = useParams() as { scheduleId: string }
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  

  const scheduleState = searchParams?.get('state')
  let schedule: AttendanceSchedule | null = null

  try {
    if (scheduleState) {
      schedule = JSON.parse(scheduleState)
    }
  } catch (error) {
    console.error("Erreur lors du parsing des données:", error)
  }

  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmationError, setConfirmationError] = useState<string | null>(null)

  const handleConfirmation = async () => {
    if (!latitude || !longitude) {
      toast.error("Position non disponible")
      return
    }

    setIsConfirming(true)
    setConfirmationError(null)

    try {
      const response = await fetch("/api/attendance/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId: params.scheduleId,
          latitude,
          longitude,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la confirmation")
      }


      await queryClient.invalidateQueries({
        queryKey: ["schedules"]
      })

      toast.success(data.message || "Présence confirmée avec succès")
      
     
      setTimeout(() => router.push(`/teacher/course-time?state=${encodeURIComponent(JSON.stringify(schedule))}`), 1500)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue"
      setConfirmationError(message)
      toast.error(message)
    } finally {
      setIsConfirming(false)
    }
  }


  if (!schedule) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <X className="w-12 h-12 text-red-500" />
        <h1 className="text-xl font-semibold">Données du planning non disponibles</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    )
  }

  return (
    <div className="container   mx-auto py-8 px-4">
      <div className="bg-zinc-900 max-w-lg rounded-xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl text-center font-semibold text-white">
            Confirmation de présence
          </h1>
          <h2 className="text-zinc-100 text-center">
            {format(new Date(schedule.startTime), "EEEE (dd-MM-yyyy)", {
              locale: fr,
            })}
          </h2>
        </div>
        <div className="space-y-4 bg-zinc-800 rounded-lg p-4">
          <div className="text-lg font-medium text-zinc-100">
            {schedule.course.name}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-300">
              <User className="h-4 w-4 text-zinc-400" />
              <span>{schedule.teacher?.name}</span>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <Clock className="h-4 w-4 text-zinc-400" />
              <span>
                {format(new Date(schedule.startTime), "HH:mm")} -{" "}
                {format(new Date(schedule.endTime), "HH:mm")}
              </span>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <MapPin className="h-4 w-4 text-zinc-400" />
              <span>{schedule.room.name}</span>
              {schedule.room.location && (
                <span className="text-sm text-zinc-500">
                  ({schedule.room.location.name})
                </span>
              )}
            </div>
          </div>

          {schedule.attendance && (
            <div className={`mt-4 p-3 rounded-md ${getStatusStyle(schedule.attendance.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {schedule.attendance.status === "PRESENT" && <Check className="w-5 h-5" />}
                  {schedule.attendance.status === "LATE" && <Clock className="w-5 h-5" />}
                  {schedule.attendance.status === "ABSENT" && <X className="w-5 h-5" />}
                  <span className="font-medium">
                    {getStatusLabel(schedule.attendance.status)}
                  </span>
                </div>
                {schedule.attendance.timestamp && (
                  <span className="text-sm opacity-75">
                    {format(new Date(schedule.attendance.timestamp), "HH:mm", { locale: fr })}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {geoError && (
            <div className="flex items-center gap-2 bg-red-500/10 text-red-500 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>Erreur de localisation: {geoError}</span>
            </div>
          )}

          {confirmationError && (
            <div className="flex items-center gap-2 bg-red-500/10 text-red-500 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{confirmationError}</span>
            </div>
          )}

          {schedule.attendance?.confirmed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 p-4 rounded-lg">
                <Check className="w-5 h-5 flex-shrink-0" />
                <div className="space-y-1">
                  <p>Présence déjà confirmée</p>
                  {schedule.attendance.timestamp && (
                    <p className="text-sm opacity-75">
                      Le {format(new Date(schedule.attendance.timestamp), "PPp", { locale: fr })}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                Retour 
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                className="w-full"
                size="lg"
                onClick={handleConfirmation}
                disabled={isConfirming || geoLoading || !!geoError}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirmation en cours...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirmer ma présence
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                Retour 
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}