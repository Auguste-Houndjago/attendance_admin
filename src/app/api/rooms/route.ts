import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { name, size } = await request.json();
        
        if (!name) {
            return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
        }
        

        const newRoom = await prisma.room.create({
          data: {
            name,
            size, 
          },
        });
        
        return NextResponse.json(newRoom, { status: 201 });
      } catch (error: any) {
        console.error("Error creating room:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Une salle avec ce nom existe déjà" }, { status: 400 });
        }
        return NextResponse.json({ error: "Error creating room" }, { status: 500 });
    }
};


export async function GET() {
  try {
     
      const rooms = await prisma.room.findMany()

      
      return NextResponse.json(rooms, { status: 201 });
    } catch (error: any) {
      console.error("Error fetching rooms:", error);

      return NextResponse.json({ error: "Error fetching rooms" }, { status: 500 });
  }
};

