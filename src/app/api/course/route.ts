import  prisma  from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { startDate: 'asc' }
    });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des cours' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const course = await prisma.course.create({ data });
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du cours' },
      { status: 500 }
    );
  }
}