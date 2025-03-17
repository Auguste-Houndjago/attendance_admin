import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user:authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const rooms = await prisma.room.findMany({
      include: {
        location: {
          select: {
            name: true,
            address: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(rooms)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}