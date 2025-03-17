import { useQuery } from '@tanstack/react-query';
import { Room } from '@/types/types';

export const useRooms = () => {
  return useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await fetch('/api/rooms');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des salles');
      }
      return response.json();
    },
  });
}; 