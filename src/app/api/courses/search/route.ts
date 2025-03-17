import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');

        if (!name) {
            return NextResponse.json([], { status: 200 });
        }

        const courses = await prisma.course.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive' 
                }
            },
            select: {
                id: true,
                name: true,

            },
            take: 4 
        });

        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        console.error("Error searching courses:", error);
        return NextResponse.json(
            { error: "Error searching courses" },
            { status: 500 }
        );
    }
}