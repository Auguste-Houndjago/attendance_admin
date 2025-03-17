import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        teacherId: params.id,
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
          },
        },
        attendances: {
          where: {
            teacherId: params.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return NextResponse.json(schedules.map(schedule => ({
      ...schedule,
      attendance: schedule.attendances[0] || null,
    })));
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des horaires' },
      { status: 500 }
    );
  }
} 