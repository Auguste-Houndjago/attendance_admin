import { Course } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

export const useCourses = () => {
  const { data: courses, isLoading, error, refetch } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses')
      if (!response.ok) throw new Error('Erreur lors du chargement des cours')
      return response.json()
    },
  })

  return { courses, loading: isLoading, error, refetch }
}
