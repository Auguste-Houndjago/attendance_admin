import { Course } from '@/types/LocalTypes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fonctions d'API séparées pour plus de clarté
const fetchCourses = async (): Promise<Course[]> => {
  const response = await fetch('/api/courses');
  if (!response.ok) throw new Error('Erreur de chargement des cours');
  return response.json();
};

const addCourseAPI = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
  const response = await fetch('/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData),
  });
  if (!response.ok) throw new Error('Erreur lors de l\'ajout du cours');
  return response.json();
};

export const useCourseManagement = () => {
  const queryClient = useQueryClient();

  // Query pour récupérer les cours
  const { 
    data: courses = [], 
    isLoading: loading, 
    error,
    refetch: refreshCourses
  } = useQuery<Course[], Error>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  // Mutation pour ajouter un cours
  const { mutateAsync: addCourse } = useMutation({
    mutationFn: addCourseAPI,
    onSuccess: (newCourse) => {
      // Met à jour le cache avec le nouveau cours
      queryClient.setQueryData<Course[]>(['courses'], (old = []) => [...old, newCourse]);
    },
    onError: (error) => {
      throw error;
    },
  });

  return { 
    courses, 
    loading, 
    error: error?.message || null,
    addCourse,
    refreshCourses
  };
};

// Hook optionnel pour récupérer un cours spécifique
export const useCourse = (courseId: string) => {
  return useQuery<Course, Error>({
    queryKey: ['courses', courseId],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) throw new Error('Erreur de chargement du cours');
      return response.json();
    },
    enabled: !!courseId, // La requête ne s'exécute que si courseId existe
  });
};

// Hook optionnel pour les mutations de cours
export const useCourseActions = () => {
  const queryClient = useQueryClient();

  const updateCourse = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Course> }) => {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du cours');
      return response.json();
    },
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData<Course[]>(['courses'], (old = []) =>
        old.map(course => course.id === updatedCourse.id ? updatedCourse : course)
      );
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du cours');
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Course[]>(['courses'], (old = []) =>
        old.filter(course => course.id !== deletedId)
      );
    },
  });

  return {
    updateCourse: updateCourse.mutateAsync,
    deleteCourse: deleteCourse.mutateAsync,
  };
}; 