import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer l'utilisateur Prisma correspondant
    const user = await prisma.user.findUnique({
      where: {
        email: authUser.email
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Récupération optimisée des schedules du professeur avec l'ID Prisma
    const schedules = await prisma.schedule.findMany({
      where: {
        startTime: {
          gte: new Date(`${params.date}T00:00:00`),
          lt: new Date(`${params.date}T23:59:59`),
        },
        teacherId: user.id, 
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        teacher: {
          select: {
            name: true,
          },
        },
        course: {
          select: {
            name: true,
          },
        },
        room: {
          select: {
            name: true,
            location: {
              select: {
                name: true,
                latitude: true,
                longitude: true,
                radius: true,
              },
            },
          },
        },
        attendances: {
          where: {
            teacherId: user.id,
          },
          select: {
            status: true,
            confirmed: true,
            timestamp: true,
            notes: true,
          },
          take: 1,
        },
      },
    })

    // Transformer les données pour correspondre à l'interface AttendanceSchedule
    const formattedSchedules = schedules.map(schedule => ({
      ...schedule,
      attendance: schedule.attendances[0] || null,
      attendances: undefined, // Supprimer le tableau d'attendances
    }))

    return NextResponse.json(formattedSchedules)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 