import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { addMinutes, subMinutes } from 'date-fns'
import { NotificationType } from '@prisma/client'

// Constantes
const NOTIFICATION_THRESHOLD = 15 // minutes avant le cours
const LATE_THRESHOLD = 30 // minutes après le début

export async function POST() {
  try {
    const now = new Date()
    const notificationTime = addMinutes(now, NOTIFICATION_THRESHOLD)
    
    // 1. Notifications de rappel avant le cours
    const upcomingSchedules = await prisma.schedule.findMany({
      where: {
        startTime: {
          gte: now,
          lte: notificationTime,
        },
        teacher: {
          isNot: null, // S'assurer qu'il y a un professeur assigné
        },
        // Vérifier si une notification n'a pas déjà été envoyée récemment
        NOT: {
          teacherId: {
            in: await prisma.notification.findMany({
              where: {
                type: NotificationType.SCHEDULE_UPDATE,
                createdAt: {
                  gte: subMinutes(now, NOTIFICATION_THRESHOLD),
                },
              },
              select: { userId: true },
            }).then(notifications => notifications.map(n => n.userId)),
          },
        },
      },
      include: {
        teacher: true,
        course: true,
        room: true,
      },
    })

    // 2. Notifications de retard
    const lateSchedules = await prisma.schedule.findMany({
      where: {
        startTime: {
          lte: subMinutes(now, LATE_THRESHOLD),
        },
        endTime: {
          gt: now, // Le cours n'est pas encore terminé
        },
        attendances: {
          none: {
            confirmed: true,
          },
        },
        teacher: {
          isNot: null,
        },
        // Vérifier si une notification de retard n'a pas déjà été envoyée
        NOT: {
          teacherId: {
            in: await prisma.notification.findMany({
              where: {
                type: NotificationType.ABSENCE,
                createdAt: {
                  gte: subMinutes(now, LATE_THRESHOLD),
                },
              },
              select: { userId: true },
            }).then(notifications => notifications.map(n => n.userId)),
          },
        },
      },
      include: {
        teacher: true,
        course: true,
        room: true,
      },
    })

    // 3. Notifications d'absence (cours manqués)
    const missedSchedules = await prisma.schedule.findMany({
      where: {
        endTime: {
          lt: now,
        },
        attendances: {
          none: {
            confirmed: true,
          },
        },
        teacher: {
          isNot: null,
        },
        // Vérifier si une notification d'absence n'a pas déjà été envoyée
        NOT: {
          teacherId: {
            in: await prisma.notification.findMany({
              where: {
                type: NotificationType.ABSENCE,
                scheduleId: {
                  not: null,
                },
              },
              select: { userId: true },
            }).then(notifications => notifications.map(n => n.userId)),
          },
        },
      },
      include: {
        teacher: true,
        course: true,
      },
    })

    // Créer toutes les notifications
    const notifications = await prisma.$transaction([
      // Notifications de rappel
      ...upcomingSchedules.map(schedule => 
        prisma.notification.create({
          data: {
            userId: schedule.teacherId!,
            scheduleId: schedule.id,
            courseId: schedule.courseId,
            type: NotificationType.SCHEDULE_UPDATE,
            message: `Rappel: Votre cours de ${schedule.course.name} commence dans ${NOTIFICATION_THRESHOLD} minutes en salle ${schedule.room.name}`,
          },
        })
      ),

      // Notifications de retard
      ...lateSchedules.map(schedule =>
        prisma.notification.create({
          data: {
            userId: schedule.teacherId!,
            scheduleId: schedule.id,
            courseId: schedule.courseId,
            type: NotificationType.ABSENCE,
            message: `Vous êtes en retard pour votre cours de ${schedule.course.name}. Veuillez confirmer votre présence.`,
          },
        })
      ),

      // Notifications d'absence
      ...missedSchedules.map(schedule =>
        prisma.notification.create({
          data: {
            userId: schedule.teacherId!,
            scheduleId: schedule.id,
            courseId: schedule.courseId,
            type: NotificationType.ABSENCE,
            message: `Vous avez manqué votre cours de ${schedule.course.name}. Veuillez justifier votre absence.`,
          },
        })
      ),
    ])

    return NextResponse.json({
      success: true,
      notificationsCount: notifications.length,
      details: {
        upcoming: upcomingSchedules.length,
        late: lateSchedules.length,
        missed: missedSchedules.length,
      },
    })

  } catch (error) {
    console.error('Erreur lors de la création des notifications:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 