import { useQuery } from "@tanstack/react-query";

const fetchData = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur de chargement: ${url}`);
  return res.json();
};

export const useScheduleData = () => {
  const { data: teachers, isLoading: loadingTeachers, isError: errorTeachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => fetchData("/api/teachers"),
  });

  const { data: courses, isLoading: loadingCourses, isError: errorCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchData("/api/courses"),
  });

  const { data: rooms, isLoading: loadingRooms, isError: errorRooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => fetchData("/api/rooms"),
  });

  const { data: schedules, isLoading: loadingSchedules, isError: errorSchedules } = useQuery({
    queryKey: ["schedules"],
    queryFn: () => fetchData("/api/schedules"),
  });

  const isLoading = loadingTeachers || loadingCourses || loadingRooms || loadingSchedules;
  const isError = errorTeachers || errorCourses || errorRooms || errorSchedules;

  return { teachers, courses, rooms, schedules, isLoading, isError };
};
