import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import prisma  from '@/lib/prisma'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    const teacher = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    if (!teacher) {
      return new NextResponse('Professeur non trouvé', { status: 404 })
    }

    return NextResponse.json(teacher)
  } catch (error) {
    console.error('Erreur:', error)
    return new NextResponse('Erreur interne du serveur', { status: 500 })
  }
} 