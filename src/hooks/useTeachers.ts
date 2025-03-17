import { useQuery } from '@tanstack/react-query';
import { Teacher } from '@/types/LocalTypes';

export const useTeachers = () => {
  return useQuery<Teacher[]>({
    queryKey: ['teachers'],
    queryFn: async () => {
      const response = await fetch('/api/teachers');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des professeurs');
      }
      return response.json();
    },
  });
}; 