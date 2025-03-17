"use client"

import { useQuery } from "@tanstack/react-query"
import { format, differenceInMinutes, addMinutes } from "date-fns"
import { fr } from "date-fns/locale"
import { Clock, MapPin, AlertCircle, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"

import Image from 'next/image';
import { AttendanceSchedule } from "@/types/types"


const EARLY_CHECK_IN_MINUTES = 15 
export default function NextCoursePage() {
  const router = useRouter()
  const [now, setNow] = useState(new Date())

  // Mettre à jour l'heure actuelle toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const { data: nextCourse, isLoading } = useQuery<AttendanceSchedule>({
    queryKey: ["next-course"],
    queryFn: async () => {
      const response = await fetch("/api/teacher/next-course")
      if (!response.ok) throw new Error("Erreur lors du chargement du prochain cours")
      return response.json()
    },
    refetchInterval: 2 * 60 * 1000,
  })
  console.log("Données reçues du backend :", nextCourse)
  if (isLoading) {
    return (
      <div className="container mx-auto h-full bg-background lg:min-h-2 p-4">
        <Card className="max-w-5xl mx-auto ">
          <div className="animate-pulse ">
            <div className=" bg-muted rounded w-3/4 mx-auto" />
            <div className=" bg-muted rounded" />
            <div className=" bg-muted rounded" />
          </div>
        </Card>
      </div>
    )
  }

  if (!nextCourse) {
    return (
      <div className="flex justify-center items-center my-auto mx-auto h-full py-8 lg:py-16 px-6">
        <Card className="w-full max-w-3xl lg:max-w-4xl mx-auto p-6">
          <Image
            src={"/empty.jpg"}
            alt="empty"
            width={200}
            height={200}
            className="rounded-md lg:min-h-96 w-full object-cover mx-auto"
          />
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 my-2 h-12 text-amber-500 mx-auto" />
            <h1 className="text-xl text-foreground font-semibold">Aucun cours à venir aujourd'hui</h1>
          </div>
        </Card>
      </div>
    )
  }

  const courseStart = new Date(nextCourse.startTime)
  const minutesUntilStart = differenceInMinutes(courseStart, now)
  const canCheckIn = minutesUntilStart <= EARLY_CHECK_IN_MINUTES && minutesUntilStart > -30 // Entre 15min avant et 30min après le début
  const checkInTime = addMinutes(courseStart, -EARLY_CHECK_IN_MINUTES)

  return (
    <div className="flex justify-center items-center my-auto mx-auto h-full py-8 px-4">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-foreground">Prochain cours</h1>
            <p className="text-muted-foreground">
              {format(courseStart, "EEEE d MMMM yyyy", { locale: fr })}
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-4">
            <div className="text-lg font-medium text-foreground">
              {nextCourse.course.name}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(courseStart, "HH:mm")} -{" "}
                  {format(new Date(nextCourse.endTime), "HH:mm")}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{nextCourse.room.name}</span>
                {nextCourse.room.location && (
                  <span className="text-sm text-muted-foreground/70">
                    ({nextCourse.room.location.name})
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 bg-card rounded-lg border">
              <CountdownDisplay
                targetTime={canCheckIn ? courseStart : checkInTime}
                canCheckIn={canCheckIn}
              />
            </div>
          </div>

          <div className="space-y-3">
            {canCheckIn ? (
              <Button
                className="w-full"
                size="lg"
                onClick={() => router.push(`/teacher/confirmation/${nextCourse.id}?state=${JSON.stringify(nextCourse)}`)}
              >
                Confirmer ma présence
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="w-full"
                size="lg"
                disabled
              >
                Confirmation possible {format(checkInTime, "à HH:mm", { locale: fr })}
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/teacher")}
            >
              Voir tous mes cours
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Composant pour le compte à rebours
function CountdownDisplay({ targetTime, canCheckIn }: { targetTime: Date; canCheckIn: boolean }) {
  const [timeLeft, setTimeLeft] = useState(differenceInMinutes(targetTime, new Date()))

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = differenceInMinutes(targetTime, new Date())
      setTimeLeft(newTimeLeft)
    }, 60000)

    return () => clearInterval(interval)
  }, [targetTime])

  const hours = Math.floor(Math.abs(timeLeft) / 60)
  const minutes = Math.abs(timeLeft) % 60

  const message = canCheckIn
    ? "Vous pouvez confirmer votre présence"
    : timeLeft > 0
    ? "Temps restant avant de pouvoir confirmer"
    : "Temps écoulé depuis le début"

  return (
    <div className="text-center space-y-2">
      <p className="text-sm text-muted-foreground">{message}</p>
      <p className="text-2xl font-bold text-foreground">
        {hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`}
      </p>
    </div>
  )
}