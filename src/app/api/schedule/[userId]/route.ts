import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;
  
    // Fetch all schedules for this teacher
    const schedules = await prisma.schedule.findMany({
      where: {
        teacherId: userId,
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        course: true,
        room: {
          include: {
            location: true,
          },
        },
        attendances: {
          where: {
            teacherId: userId,
          },
        },
      },
    });

    // Transform the data for the frontend
    const formattedSchedule = schedules.map(schedule => ({
      id: schedule.id,
      courseId: schedule.course.id,
      courseName: schedule.course.name,
      roomId: schedule.room.id,
      roomName: schedule.room.name,
      locationName: schedule.room.location?.name,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      day: schedule.day,
      attendance: schedule.attendances.length > 0 ? {
        id: schedule.attendances[0].id,
        status: schedule.attendances[0].status,
        timestamp: schedule.attendances[0].timestamp,
        confirmed: schedule.attendances[0].confirmed,
      } : null,
    }));

    return NextResponse.json(formattedSchedule);
  } catch (error) {
    console.error('Error fetching teacher schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teacher schedule' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { courseId, roomId, day, startTime, endTime } = await request.json();
    const userId = params.userId;

    // Verify that the teacher is assigned to this course
    const courseTeacher = await prisma.courseTeacher.findFirst({
      where: {
        teacherId: userId,
        courseId: courseId,
      },
    });

    if (!courseTeacher) {
      return NextResponse.json(
        { error: 'Teacher is not assigned to this course' },
        { status: 403 }
      );
    }

    // Check for scheduling conflicts
    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        day: day,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
        roomId: roomId,
      },
    });

    if (existingSchedule) {
      return NextResponse.json(
        { error: 'Schedule conflict detected' },
        { status: 409 }
      );
    }

    // Create new schedule
    const schedule = await prisma.schedule.create({
      data: {
        courseId,
        roomId,
        day,
        startTime,
        endTime,
      },
      include: {
        course: true,
        room: true,
      },
    });

    return NextResponse.json({
      id: schedule.id,
      courseId: schedule.courseId,
      courseName: schedule.course.name,
      roomId: schedule.roomId,
      roomName: schedule.room.name,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      day: schedule.day,
    });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    );
  }
}