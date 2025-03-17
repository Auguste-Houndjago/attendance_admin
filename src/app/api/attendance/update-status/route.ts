import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { subMinutes } from 'date-fns'

export async function POST(request: Request) {
  try {
    const now = new Date()

    // Mettre à jour les présences non confirmées pour les cours terminés
    const updateAbsences = await prisma.schedule.findMany({
      where: {
        endTime: { lt: now },
        attendances: {
          none: {
            confirmed: true
          }
        }
      },
      include: {
        course: true,
        teacher: true
      }
    })

    // Créer les enregistrements d'absence
    await Promise.all(
      updateAbsences.map(schedule => 
        prisma.attendance.create({
          data: {
            scheduleId: schedule.id,
            teacherId: schedule.teacherId!,
            courseId: schedule.courseId,
            status: 'ABSENT',
            confirmed: false,
            timestamp: schedule.endTime,
            notes: 'Absence automatiquement enregistrée'
          }
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: 'Statuts mis à jour avec succès',
      updatedCount: updateAbsences.length
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour des statuts:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des statuts' },
      { status: 500 }
    )
  }
} 