import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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

    const schedule = await prisma.schedule.findUnique({
      where: { id: params.id },
      include: {
        course: { select: { name: true } },
        teacher: { select: { name: true } },
        room: {
          select: {
            name: true,
            location: { select: { name: true } },
          },
        },
        attendances: {
          where: { teacherId: user.id },
          select: { status: true, confirmed: true },
        },
      },
    })

    if (!schedule) {
      return NextResponse.json(
        { error: 'Planning non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...schedule,
      attendance: schedule.attendances[0],
    })
  } catch (error) {
    console.error('Erreur GET:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const schedule = await prisma.schedule.update({
      where: { id: params.id },
      data
    })
    return NextResponse.json(schedule)
  } catch (error) {
    console.error('Erreur PUT:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du planning' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.schedule.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'horaire' },
      { status: 500 }
    )
  }
}
