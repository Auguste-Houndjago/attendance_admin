"use client"

import CourseGrid from "@/components/courses/CourseGrid";

import NextCoursePage from "./next-course/page";
import { useTodayCourses } from "@/hooks/useTodayCourses";
import { Schedule } from "@/types/types";



export default function TeacherPage() {
  const { courses, isLoading } = useTodayCourses();



  const formattedCourses = courses.map((schedule: Schedule) => ({
    id: schedule.id,
    name: schedule.course.name,
    startDate: new Date(schedule.startTime),
    endDate: new Date(schedule.endTime),
  }));
  return (

    <div className='flex w-full justify-center flex-row gap-y-4'>


      <div className='flex flex-col gap-y-4'>
        <div className='flex flex-1    rounded-xl'>
          <NextCoursePage />
        </div>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded" />
          </div>
        ) : (
          <CourseGrid courses={formattedCourses} />
        )}
      </div>
    </div>


  )
}