import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useCourseManagement } from '@/hooks/useCourseManagement';
import { useScheduleManagement } from '@/hooks/useScheduleManagement';
import { useTeachers } from '@/hooks/useTeachers';
import { useRooms } from '@/hooks/useRooms';
import type { Course, Schedule } from '@/types/types';

export function useCalendarManagement() {
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
    addCourse,
  } = useCourseManagement();

  const {
    schedules,
    loading: schedulesLoading,
    error: schedulesError,
    updateSchedule,
    addSchedule,
  } = useScheduleManagement();

  const {
    data: teachers = [],
    isLoading: teachersLoading,
    error: teachersError,
  } = useTeachers();

  const {
    data: rooms = [],
    isLoading: roomsLoading,
    error: roomsError,
  } = useRooms();

  const handleScheduleUpdate = useCallback(async (updatedSchedule: Schedule) => {
    try {
      await updateSchedule(updatedSchedule);
      toast({
        title: "Planning mis à jour",
        description: "Le planning a été mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le planning",
        variant: "destructive",
      });
    }
  }, [updateSchedule]);

  const handleScheduleAdd = useCallback(async (newSchedule: Omit<Schedule, 'id'>) => {
    try {
      await addSchedule(newSchedule);
      toast({
        title: "Cours planifié",
        description: "Le cours a été ajouté au planning avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le cours au planning",
        variant: "destructive",
      });
    }
  }, [addSchedule]);

  const handleAddCourse = useCallback(async (newCourse: Omit<Course, 'id'>) => {
    if (!newCourse.name || !newCourse.startDate) {
      toast({
        title: "Erreur",
        description: "Le nom du cours et la date de début sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      await addCourse(newCourse);
      toast({
        title: "Cours ajouté",
        description: "Le cours a été ajouté avec succès",
      });
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le cours",
        variant: "destructive",
      });
      return false;
    }
  }, [addCourse]);

  const isLoading = coursesLoading || schedulesLoading || teachersLoading || roomsLoading;
  const error = coursesError || schedulesError || teachersError || roomsError;

  return {
    courses,
    schedules,
    teachers,
    rooms,
    isLoading,
    error,
    handleScheduleUpdate,
    handleScheduleAdd,
    handleAddCourse,
  };
} 