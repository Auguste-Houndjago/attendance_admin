"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Loader2 } from "lucide-react"

interface Teacher {
  id: string
  name: string
}

interface Course {
  id: string
  name: string
}

interface Room {
  id: string
  name: string
}

interface Schedule {
  id: string
  roomId: string
  day: string
  startTime: string
  endTime: string
}

interface AssignScheduleProps {
  teachers: Teacher[]
  courses: Course[]
  rooms: Room[]
  schedules: Schedule[]
}

interface FormData {
  teacherId: string
  courseId: string
  roomId: string
  day: string
  startTime: string
  endTime: string
}

export default function AssignSchedule({ teachers, courses, rooms, schedules }: AssignScheduleProps) {
  const [formData, setFormData] = useState<FormData>({
    teacherId: "",
    courseId: "",
    roomId: "",
    day: "",
    startTime: "",
    endTime: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const daysOfWeek = [
    { id: "MONDAY", name: "Lundi" },
    { id: "TUESDAY", name: "Mardi" },
    { id: "WEDNESDAY", name: "Mercredi" },
    { id: "THURSDAY", name: "Jeudi" },
    { id: "FRIDAY", name: "Vendredi" },
    { id: "SATURDAY", name: "Samedi" },
    { id: "SUNDAY", name: "Dimanche" },
  ]

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const checkScheduleConflict = (): boolean => {
    const roomSchedules = schedules.filter(schedule => schedule.roomId === formData.roomId && schedule.day === formData.day)
    
    for (const schedule of roomSchedules) {
      const newStart = new Date(`1970-01-01T${formData.startTime}`)
      const newEnd = new Date(`1970-01-01T${formData.endTime}`)
      const existingStart = new Date(`1970-01-01T${schedule.startTime}`)
      const existingEnd = new Date(`1970-01-01T${schedule.endTime}`)

      if (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        setError("Il y a un conflit d'horaire dans cette salle. Veuillez choisir un autre créneau.")
        return true
      }
    }
    return false
  }

  const validateForm = (): boolean => {
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        setError(`Le champ ${key} est requis.`)
        return false
      }
    }
    if (formData.startTime >= formData.endTime) {
      setError("L'heure de fin doit être après l'heure de début.")
      return false
    }
    if (checkScheduleConflict()) {
      return false
    }
    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch("/api/assign-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Échec de l'assignation du planning.")
      }

      setSuccess("Planning assigné avec succès !")
      setFormData({
        teacherId: "",
        courseId: "",
        roomId: "",
        day: "",
        startTime: "",
        endTime: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Assigner un planning</CardTitle>
        <CardDescription>
          Créez un nouveau créneau dans le planning en remplissant tous les champs ci-dessous.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teacher">Professeur</Label>
              <Select value={formData.teacherId} onValueChange={(value) => handleSelectChange("teacherId", value)}>
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Sélectionner un professeur" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Cours</Label>
              <Select value={formData.courseId} onValueChange={(value) => handleSelectChange("courseId", value)}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Sélectionner un cours" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room">Salle</Label>
              <Select value={formData.roomId} onValueChange={(value) => handleSelectChange("roomId", value)}>
                <SelectTrigger id="room">
                  <SelectValue placeholder="Sélectionner une salle" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="day">Jour</Label>
              <Select value={formData.day} onValueChange={(value) => handleSelectChange("day", value)}>
                <SelectTrigger id="day">
                  <SelectValue placeholder="Sélectionner un jour" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.id} value={day.id}>
                      {day.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Heure de début</Label>
              <Input
                id="startTime"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin</Label>
              <Input
                id="endTime"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              "Assigner le planning"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

