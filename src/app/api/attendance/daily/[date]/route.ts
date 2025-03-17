import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  try {
    // Récupérer la session de l'utilisateur
    const supabase = await createClient();
    const { data: { user:authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur depuis Prisma
    const user = await prisma.user.findUnique({
      where: { email: authUser.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        startTime: {
          gte: new Date(`${params.date}T00:00:00`),
          lt: new Date(`${params.date}T23:59:59`),
        },
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            location: {
              select: {
                id: true,
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
            teacherId: user.id, // Filtrer les présences pour l'utilisateur connecté
          },
          select: {
            status: true,
            confirmed: true,
            notes: true,
            timestamp: true,
          },
        },
      },
    });

    // Transformer les données pour correspondre au format attendu
    const formattedSchedules = schedules.map(schedule => ({
      ...schedule,
      attendance: schedule.attendances[0] || null, // Prendre la première présence ou null
      attendances: undefined, // Supprimer le tableau d'attendances
    }));

    return NextResponse.json(formattedSchedules);
  } catch (error) {
    console.error('Erreur lors de la récupération des présences:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 