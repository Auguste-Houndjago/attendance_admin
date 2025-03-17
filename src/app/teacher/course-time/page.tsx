"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { format, differenceInSeconds } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Clock, MapPin, Check, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSearchParams, useRouter } from 'next/navigation'
import { useGeolocation } from "@/hooks/useGeolocation"
import { toast } from 'sonner'

export default function CourseTimePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isEnded, setIsEnded] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const { latitude, longitude, error: geoError } = useGeolocation()

  const scheduleData = searchParams?.get('state')
  const schedule = scheduleData ? JSON.parse(decodeURIComponent(scheduleData)) : null

  useEffect(() => {
    if (!schedule) return

    const interval = setInterval(() => {
      const now = new Date()
      const end = new Date(schedule.endTime)
      const secondsLeft = differenceInSeconds(end, now)
      
      setTimeLeft(secondsLeft)
      if (secondsLeft <= 0) {
        setIsEnded(true)
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [schedule])

  const handleEndConfirmation = async () => {
    if (!latitude || !longitude) {
      toast.error("Position non disponible")
      return
    }

    setIsConfirming(true)
    try {
      // Simulation d'un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success("Fin du cours confirmée avec succès")
      setTimeout(() => router.push('/teacher'), 1000)
    } catch (error) {
      toast.error("Erreur lors de la simulation")
    } finally {
      setIsConfirming(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(Math.abs(seconds) / 3600)
    const minutes = Math.floor((Math.abs(seconds) % 3600) / 60)
    const secs = Math.abs(seconds) % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!schedule) {
    return <div className="text-center p-4">Aucune donnée de cours disponible</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-lg mx-auto bg-zinc-900 p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-zinc-100">
              {schedule.course.name}
            </h1>
            <p className="text-zinc-400">
              {format(new Date(schedule.startTime), "EEEE d MMMM yyyy", { locale: fr })}
            </p>
          </div>

          <div className="bg-zinc-800 flex items-center flex-col rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-zinc-300">
              <Clock className="h-4 w-4 text-zinc-400" />
              <span>
                {schedule.attendance?.timestamp 
                  ? `Confirmation à ${format(new Date(schedule.attendance.timestamp), "HH:mm")}`
                  : "En attente de confirmation de fin"
                }
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <MapPin className="h-4 w-4 text-zinc-400" />
              <span>{schedule.room.name}</span>
            </div>
          </div>

          <motion.div 
            className="text-center py-8"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="text-4xl font-bold text-zinc-100">
              {timeLeft > 0 ? formatTime(timeLeft) : "Cours terminé"}
            </div>
            <p className="text-zinc-400 mt-2">
              {timeLeft > 0 ? "Temps restant" : ""}
            </p>
          </motion.div>

          {isEnded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-4"
            >
              <Button
                className="w-full"
                size="lg"
                onClick={handleEndConfirmation}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirmation en cours...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirmer la fin du cours
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </Card>
    </div>
  )
}
