import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from '@/utils/supabase/server';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const userId = authUser.user_metadata.prisma_user_id;
    const today = new Date();
    
    const todayCourses = await prisma.schedule.findMany({
      where: {
        teacherId: userId,
        startTime: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        course: true,
        room: {
          include: {
            location: true,
          },
        },
        attendances: {
          where: {
            teacherId: userId,
          },
        },
      },
    });

    return NextResponse.json(todayCourses);
  } catch (error) {
    console.error("Erreur dans l'API :", error);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 }
    );
  }
} 