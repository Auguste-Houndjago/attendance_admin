import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';



export async function GET (){


try {
    const teatcher = await prisma.user.findMany({where:{role:'TEACHER'}   })

return NextResponse.json(teatcher)

} catch (error) {
    console.error("Error fetchin teacher: ", error)
    return NextResponse.json({error:"failed to fetch teachers"})
}

}