import  prisma  from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        course: true,
        room: true
      }
    })
    return NextResponse.json(schedules)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des plannings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const schedule = await prisma.schedule.create({
      data
    })
    return NextResponse.json(schedule)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du planning' },
      { status: 500 }
    )
  }
} 