import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { differenceInMinutes } from 'date-fns'

export async function GET(request: Request) {
  try {
    // Récupérer les paramètres de date
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

    // Récupérer les cours pour la période
    const schedules = await prisma.schedule.findMany({
      where: {
        teacherId: user.id,
        startTime: {
          gte: start,
          lte: end
        }
      },
      include: {
        course: {
          select: {
            name: true
          }
        }
      }
    })

    // Calculer les durées par cours
    const courseStats = schedules.reduce((acc, schedule) => {
      const courseName = schedule.course.name
      const duration = differenceInMinutes(new Date(schedule.endTime), new Date(schedule.startTime))

      if (!acc[courseName]) {
        acc[courseName] = 0
      }
      acc[courseName] += duration
      return acc
    }, {} as Record<string, number>)

    // Formater les données
    const courses = Object.entries(courseStats).map(([name, duration]) => ({
      name,
      duration
    }))

    const total = courses.reduce((sum, course) => sum + course.duration, 0)

    return NextResponse.json({
      courses,
      total
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 