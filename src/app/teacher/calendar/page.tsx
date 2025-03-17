'use client';

import { useEffect, useState } from 'react';
import { TeacherCalendarView } from '@/components/Teacher/TeacherCalendarView';
import { createClient } from '@/utils/supabase/client';


import { getUserInfo } from '@/utils/getUserInfo';

export default async function TeacherCalendarPage() {
  const user = await getUserInfo();



const teacherId = user?.userPId

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Mon calendrier de cours</h1>
      {/* <TeacherScheduleList teacherId={teacherId} /> */}
      <TeacherCalendarView teacherId={teacherId} />
    </div>
  );
}