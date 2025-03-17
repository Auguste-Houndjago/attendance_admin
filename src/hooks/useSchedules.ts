import { Schedule } from '@prisma/client'
import { useState, useEffect } from 'react'

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules')
      if (!response.ok) throw new Error('Erreur lors du chargement des plannings')
      const data = await response.json()
      setSchedules(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const updateSchedule = async (schedule: Partial<Schedule>) => {
    try {
      const response = await fetch(`/api/schedules/${schedule.id || 'new'}`, {
        method: schedule.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule)
      })
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du planning')
      await fetchSchedules() // Recharger les données
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  return { schedules, loading, error, updateSchedule, refetch: fetchSchedules }
} 