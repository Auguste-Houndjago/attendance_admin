'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Clock, MapPin, BookOpen } from 'lucide-react';

interface TeacherScheduleListProps {
  teacherId: string;
}

interface ScheduleEvent {
  id: string;
  courseId: string;
  courseName: string;
  roomId: string;
  roomName: string;
  startTime: string;
  endTime: string;
  day: string;
}

export function TeacherScheduleList({ teacherId }: TeacherScheduleListProps) {
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`/api/schedule/${teacherId}`);
        if (!response.ok) throw new Error('Erreur lors du chargement du planning');
        
        const data: ScheduleEvent[] = await response.json();
        
        // Trier les horaires par heure de début
        const sortedSchedules = [...data].sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        
        setSchedules(sortedSchedules);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [teacherId]);

  if (loading) {
    return <div className="p-4 text-center">Chargement du planning...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Erreur: {error}</div>;
  }

  if (schedules.length === 0) {
    return <div className="p-4 text-center">Aucun cours programmé</div>;
  }

  return (
    <div className="relative">
      <h3 className="text-lg font-medium mb-2">Planning des cours</h3>
      
      {/* Conteneur avec scroll horizontal */}
      <div className="flex space-x-4 overflow-x-auto scrollbar-hidden p-2">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="bg-background min-w-40 flex items-center  border p-1 px-4 shadow-sm">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{schedule.courseName}</span>
              </div>
              
              <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {format(parseISO(schedule.startTime), 'HH:mm')} - {format(parseISO(schedule.endTime), 'HH:mm')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{schedule.roomName}</span>
                  </div>
              </div>
            </div>
          </Card>
        ))}

      </div>
    </div>
  );
}
