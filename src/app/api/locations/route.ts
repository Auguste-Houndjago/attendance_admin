import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user:authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }
    

    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(locations)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user:authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const location = await prisma.location.create({
      data: {
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        radius: data.radius,
      },
    })

    return NextResponse.json(location)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 



// // Dans une page admin
// import { CreateLocation } from "@/components/location/CreateLocation"
// import { AssignLocation } from "@/components/location/AssignLocation"

// export default function LocationManagementPage() {
//   return (
//     <div className="container mx-auto p-4 space-y-8">
//       <CreateLocation />
      
//       {/* Pour chaque salle */}
//       <div className="bg-zinc-900 rounded-xl p-6">
//         <h2 className="text-xl font-semibold mb-4">Assigner une localisation</h2>
//         <AssignLocation roomId="room-id" />
//       </div>
//     </div>
//   )
// }
