import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { locationId } = await request.json()

    const room = await prisma.room.update({
      where: { id: params.roomId },
      data: { locationId },
    })

    return NextResponse.json(room)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 