import { createClient } from '@/utils/supabase/server';
import { Role, Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';



export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated please login before' },
        { status: 401 }
      );
    }


   const teacher = await prisma.user.findFirst({
    where:{email:user.email,
        role:Role.TEACHER

    }
   })


   if (!teacher) {
    return NextResponse.json(
        {error:'not autorised , user have not role TEACHER'},
        {status:403}
    )
   };

   console.log('teacher mail', teacher.email)

const {courseId , status , notes}:{courseId:string , status:Status , notes:string } = await request.json()


if (!courseId || !status  ) {
    return NextResponse.json({error: 'courseId or status are missing  '}, {status:400})
}

console.log('course id : ' , courseId)

const { scheduleId } = await request.json();

if (!scheduleId) {
  return NextResponse.json({ error: 'scheduleId is missing' }, { status: 400 });
}

const attendanceRecord = await prisma.attendance.create({
  data: {
    courseId,
    teacherId: teacher.id,
    status,
    notes: notes || undefined,
    scheduleId
  }
});
return NextResponse.json(attendanceRecord, {status:201})
   
  } catch (error) {
    console.error('error creating attendance record:', error);
    return NextResponse.json(
      { error: 'Failed to record attendance record' },
      { status: 500 }
    );
  }
}




