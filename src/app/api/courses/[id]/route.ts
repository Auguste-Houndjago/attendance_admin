import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function PUT( request:NextRequest, 

    {params}:{params:{id:string}}
 ) {
try {

    const courseEdit = await request.json();

    const updatedCourse = await prisma.course.update({
        where:{id:params.id},

        data: courseEdit
    })

    return NextResponse.json(updatedCourse, {status:200})
} catch (error) {
    
    console.log('Error updating course: ' , error)
    return NextResponse.json({error:'error updating course'}, {status:500})
}
    
}