import  prisma  from "@/lib/prisma"

interface ConfirmAttendanceParams {
  scheduleId: string
  teacherId: string
  userLat: number
  userLon: number
}

export async function confirmAttendance({
  scheduleId,
  teacherId,
  userLat,
  userLon,
}: ConfirmAttendanceParams) {
  // Récupérer le planning avec les informations de la salle et sa localisation
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      room: {
        include: {
          location: true,
        },
      },
      course: true,
    },
  })

  if (!schedule) {
    throw new Error("Planning non trouvé")
  }

  if (!schedule.room.location) {
    throw new Error("Aucune localisation définie pour cette salle")
  }

  // Vérifier si l'utilisateur est dans la zone
  const isWithinRange = await prisma.$queryRaw<{inside: boolean}[]>`
    SELECT EXISTS (
      SELECT 1 FROM "Location"
      WHERE id = ${schedule.room.location.id}
      AND ST_DWithin(
        ST_SetSRID(ST_MakePoint(${userLon}, ${userLat}), 4326)::geography,
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
        radius
      )
    ) AS "inside"
  `

  if (!isWithinRange[0].inside) {
    throw new Error("Vous êtes trop loin de la salle pour confirmer votre présence")
  }

  // Créer ou mettre à jour la présence
  const attendance = await prisma.attendance.upsert({
    where: {
      scheduleId_teacherId: {
        scheduleId,
        teacherId,
      },
    },
    update: {
      status: "PRESENT",
      confirmed: true,
      timestamp: new Date(),
    },
    create: {
      scheduleId,
      teacherId,
      courseId: schedule.courseId,
      status: "PRESENT",
      confirmed: true,
    },
  })

  return attendance
} 