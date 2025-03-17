import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Status } from '@prisma/client'

export async function GET(request: Request) {
  try {
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

    // Statistiques globales
    const totalAttendances = await prisma.attendance.count({
      where: { teacherId: user.id }
    })

    // Statistiques par statut
    const statusStats = await prisma.attendance.groupBy({
      by: ['status'],
      where: { teacherId: user.id },
      _count: true,
    })

    // Statistiques par cours
    const courseStats = await prisma.attendance.groupBy({
      by: ['courseId'],
      where: { teacherId: user.id },
      _count: true,
      orderBy: {
        _count: {
          courseId: 'desc'
        }
      },
      take: 5, // Top 5 cours
    })

    // Récupérer les noms des cours
    const courseDetails = await prisma.course.findMany({
      where: {
        id: {
          in: courseStats.map(stat => stat.courseId)
        }
      },
      select: {
        id: true,
        name: true,
      }
    })

    return NextResponse.json({
      total: totalAttendances,
      byStatus: statusStats.map(stat => ({
        name: stat.status,
        value: stat._count
      })),
      byCourse: courseStats.map(stat => ({
        name: courseDetails.find(c => c.id === stat.courseId)?.name || 'Unknown',
        value: stat._count
      }))
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 