"use client";
import React from "react";

import { useScheduleData } from "@/hooks/useScheduleData";
import AssignSchedule from "@/components/admin/dashboard/AssignSchedule";

const Schedule: React.FC = () => {
  const { teachers, courses, rooms, schedules, isLoading, isError } = useScheduleData();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Erreur de chargement des données</div>;
  }

  return (
    <div>
      <AssignSchedule teachers={teachers} courses={courses} rooms={rooms} schedules={schedules} />
    </div>
  );
};

export default Schedule;