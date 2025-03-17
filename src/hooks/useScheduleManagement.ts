import { Schedule } from '@/types/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchSchedules = async (): Promise<Schedule[]> => {
  const response = await fetch('/api/schedules');
  if (!response.ok) throw new Error('Erreur de chargement des horaires');
  return response.json();
};

const updateScheduleAPI = async (schedule: Schedule): Promise<Schedule> => {
  const response = await fetch(`/api/schedules/${schedule.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schedule),
  });
  if (!response.ok) throw new Error('Erreur lors de la mise à jour');
  return response.json();
};

const addScheduleAPI = async (schedule: Omit<Schedule, 'id'>): Promise<Schedule> => {
  const response = await fetch('/api/schedules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schedule),
  });
  if (!response.ok) throw new Error('Erreur lors de l\'ajout');
  return response.json();
};

export const useScheduleManagement = () => {
  const queryClient = useQueryClient();

  // Query pour récupérer les horaires
  const { 
    data: schedules = [], 
    isLoading: loading,
    error,
    refetch: refreshSchedules
  } = useQuery({
    queryKey: ['schedules'],
    queryFn: fetchSchedules,
  });

  // Mutation pour mettre à jour un horaire
  const updateMutation = useMutation({
    mutationFn: updateScheduleAPI,
    onMutate: async (newSchedule) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: ['schedules'] });

      // Sauvegarder l'état précédent
      const previousSchedules = queryClient.getQueryData<Schedule[]>(['schedules']);

      // Optimistically update
      queryClient.setQueryData<Schedule[]>(['schedules'], (old = []) =>
        old.map(schedule => schedule.id === newSchedule.id ? newSchedule : schedule)
      );

      return { previousSchedules };
    },
    onError: (err, newSchedule, context) => {
      // En cas d'erreur, restaurer l'état précédent
      queryClient.setQueryData(['schedules'], context?.previousSchedules);
    },
    onSettled: () => {
      // Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  // Mutation pour ajouter un horaire
  const addMutation = useMutation({
    mutationFn: addScheduleAPI,
    onSuccess: (newSchedule) => {
      queryClient.setQueryData<Schedule[]>(['schedules'], (old = []) => 
        [...old, newSchedule]
      );
    },
  });

  return {
    schedules,
    loading,
    error: error?.message || null,
    updateSchedule: updateMutation.mutateAsync,
    addSchedule: addMutation.mutateAsync,
    refreshSchedules,
  };
}; 