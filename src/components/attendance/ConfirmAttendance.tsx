"use client"

import { useState } from "react"
import { Check, Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGeolocation } from "@/hooks/useGeolocation"
import { toast } from "sonner"

interface ConfirmAttendanceProps {
  scheduleId: string
  roomName: string
  isConfirmed?: boolean
  onConfirmSuccess?: () => void
}

export function ConfirmAttendance({ 
  scheduleId, 
  roomName,
  isConfirmed = false,
  onConfirmSuccess 
}: ConfirmAttendanceProps) {
  const [confirming, setConfirming] = useState(false)
  const { latitude, longitude, error, loading } = useGeolocation()

  const handleConfirmAttendance = async () => {
    if (!latitude || !longitude) {
      toast.error("Position non disponible")
      return
    }

    setConfirming(true)
    try {
      const response = await fetch("/api/attendance/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId,
          latitude,
          longitude,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de la confirmation")
      }

      toast.success("Présence confirmée avec succès")
      onConfirmSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setConfirming(false)
    }
  }

  if (isConfirmed) {
    return (
      <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 rounded-lg p-2">
        <Check className="w-4 h-4" />
        <span className="text-sm">Présence confirmée</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-zinc-400 text-sm">
        <MapPin className="w-4 h-4" />
        <span>Localisation requise pour {roomName}</span>
      </div>

      {error && (
        <p className="text-sm text-red-400">
          Erreur de localisation: {error}
        </p>
      )}

      <Button
        onClick={handleConfirmAttendance}
        disabled={confirming || loading || !!error}
        variant="outline"
        className="w-full gap-2"
      >
        {confirming ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Confirmation en cours...
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            Confirmer ma présence
          </>
        )}
      </Button>
    </div>
  )
} 