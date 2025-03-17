
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { courseName, startDate, abbreviation } = await request.json();
        if (!courseName || !startDate || !abbreviation) {
            
        }

        console.time('prisma-create-course');
        const course = await prisma.course.create({
            data: {
                name: courseName,
                startDate: new Date(startDate),
                abbreviation: abbreviation,
            },
        });
        console.timeEnd('prisma-create-course');

        return NextResponse.json({ success: true, course }, { status: 201 });
    } catch (error) {
        console.error("Error creating course:", error);
        return NextResponse.json({ error: "Error creating course" }, { status: 500 });
    }
}


export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            orderBy:{updatedAt:'desc'}
        });

       
        return NextResponse.json(courses);

    } catch (error) {
        console.error("Error fetching courses : ", error);
        return NextResponse.json({ error: "Error fetching courses " }, { status: 500 });
    }
}


// export async function GET() {
//     try {
//         const courses = await prisma.course.findMany({
//             select: { name: true }, 
//         });
//         const courseNames = courses.map(course => course.name);
//         return NextResponse.json(courseNames);
//     } catch (error) {
//         console.error("Error fetching course names:", error);
//         return NextResponse.json({ error: "Error fetching course names" }, { status: 500 });
//     }
// }









