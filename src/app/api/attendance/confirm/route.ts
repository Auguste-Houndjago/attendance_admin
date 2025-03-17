import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { addMinutes, isAfter, isBefore, subMinutes } from 'date-fns'

interface LocationCheckResult {
  inside: boolean
}

// Constantes pour la configuration
const LATE_THRESHOLD_MINUTES = 30
const EARLY_CHECK_IN_MINUTES = 15 

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user:authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { scheduleId, latitude, longitude } = await request.json()

    console.log("locations :" , "longitude :",longitude ," latitide :",latitude )

    if (!scheduleId || !latitude || !longitude) {
        console.log("donnee manquantes")
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }
    
    console.log("locations apres :" , "longitude :",longitude ," latitide :",latitude )


    // Récupérer le planning avec toutes les informations nécessaires
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        room: {
          include: {
            location: true,
          },
        },
        course: true,
        attendances: {
          where: {
            teacherId: authUser.id,
          },
        },
      },
    })

    if (!schedule) {
        console.log("Planning non trouver ")
      return NextResponse.json(
        { error: 'Planning non trouvé' },
        { status: 404 }
      )
    }

    if (!schedule.room.location) {
        console.log("aucune localisation sur cette salle")
      return NextResponse.json(
        { error: 'Aucune localisation définie pour cette salle' },
        { status: 400 }
      )
    }

    // Vérifications temporelles
    const now = new Date()
    const startTime = new Date(schedule.startTime)
    const endTime = new Date(schedule.endTime)
    const earlyCheckInTime = subMinutes(startTime, EARLY_CHECK_IN_MINUTES)
    const lateThresholdTime = addMinutes(startTime, LATE_THRESHOLD_MINUTES)

    // Vérifier si le cours est déjà terminé
    if (isAfter(now, endTime)) {
      return NextResponse.json(
        { error: 'Le cours est terminé, confirmation impossible' },
        { status: 400 }
      )
    }

    // Vérifier si on n'est pas trop en avance
    if (isBefore(now, earlyCheckInTime)) {
      return NextResponse.json(
        { 
          error: `La confirmation n'est possible que ${EARLY_CHECK_IN_MINUTES} minutes avant le début du cours`,
          startTime,
          earlyCheckInTime 
        },
        { status: 400 }
      )
    }

    // Déterminer le statut en fonction de l'heure
    let status: 'PRESENT' | 'LATE' = 'PRESENT'
    if (isAfter(now, lateThresholdTime)) {
      status = 'LATE'
    }

    // Vérifier si l'utilisateur est dans la zone
    const result = await prisma.$queryRaw<LocationCheckResult[]>`
      SELECT EXISTS (
        SELECT 1 FROM "Location"
        WHERE id = ${schedule.room.location.id}
        AND ST_DWithin(
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
          ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
          radius
        )
      ) AS "inside"
    `

    if (!result[0].inside) {
      return NextResponse.json(
        { error: 'Vous êtes trop loin de la salle pour confirmer votre présence' },
        { status: 400 }
      )
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: authUser.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Créer ou mettre à jour la présence
    const attendance = await prisma.attendance.upsert({
      where: {
        scheduleId_teacherId: {
          scheduleId,
          teacherId: user.id,
        },
      },
      update: {
        status,
        confirmed: true,
        timestamp: now,
      },
      create: {
        scheduleId,
        teacherId: user.id,
        courseId: schedule.courseId,
        status,
        confirmed: true,
        timestamp: now,
      },
    })

    return NextResponse.json({
      success: true,
      attendance,
      message: status === 'LATE' ? 'Présence confirmée avec retard' : 'Présence confirmée'
    })

  } catch (error) {
    console.error('Erreur de confirmation de présence:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la confirmation de présence' },
      { status: 500 }
    )
  }
} 