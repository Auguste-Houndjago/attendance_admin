import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    const userId = authUser.user_metadata.prisma_user_id;
    
    const nextCourse = await prisma.schedule.findFirst({
      where: {
        teacherId: userId,
        startTime: {
          gte: new Date(),
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
          take: 1,
        },
      },
    });

    console.log("Données récupérées :", nextCourse);

    return NextResponse.json(nextCourse);
  } catch (error) {
    console.error("Erreur dans l'API :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}












