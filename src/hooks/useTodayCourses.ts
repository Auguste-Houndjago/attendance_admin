import { useQuery } from '@tanstack/react-query';
import { Schedule } from '@/types/types';

const fetchTodayCourses = async (): Promise<Schedule[]> => {
  const response = await fetch('/api/teacher/today-courses');
  if (!response.ok) throw new Error('Erreur lors du chargement des cours');
  return response.json();
};

export const useTodayCourses = () => {
  const { 
    data: courses = [], 
    isLoading,
    error,
    refetch
  } = useQuery<Schedule[]>({
    queryKey: ['today-courses'],
    queryFn: fetchTodayCourses,
    refetchInterval: 5 * 60 * 1000, 
  });

  return {
    courses,
    isLoading,
    error: error?.message || null,
    refetch
  };
}; 