import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { differenceInMinutes } from 'date-fns'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const start = new Date(searchParams.get('start') || '')
    const end = new Date(searchParams.get('end') || '')

    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: authUser.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer tous les schedules et leurs attendances pour la période
    const schedules = await prisma.schedule.findMany({
      where: {
        teacherId: user.id,
        startTime: {
          gte: start,
          lte: end
        }
      },
      include: {
        attendances: {
          where: {
            teacherId: user.id
          }
        }
      }
    })

    // Calculer les heures totales et par statut
    let totalMinutes = 0
    const statusMinutes = {
      PRESENT: 0,
      LATE: 0,
      ABSENT: 0
    }

    schedules.forEach(schedule => {
      const duration = differenceInMinutes(new Date(schedule.endTime), new Date(schedule.startTime))
      totalMinutes += duration

      if (schedule.attendances[0]) {
        statusMinutes[schedule.attendances[0].status] += duration
      } else {
        // Si pas d'attendance, considéré comme absent
        statusMinutes.ABSENT += duration
      }
    })

    // Convertir en heures et calculer les pourcentages
    const totalHours = Math.round(totalMinutes / 60)
    const statuses = Object.entries(statusMinutes).map(([status, minutes]) => ({
      status,
      hours: Math.round(minutes / 60),
      percentage: totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0
    }))

    return NextResponse.json({
      statuses,
      totalHours
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 