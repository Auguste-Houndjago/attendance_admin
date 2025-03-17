'use client';

import { useEffect, useState } from 'react';
import { fr } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import {
  CalendarProvider,
  CalendarHeader,
  CalendarBody,
  CalendarDate,
  CalendarDatePicker,
  CalendarMonthPicker,
  CalendarYearPicker,
  CalendarDatePagination,
  Feature,
  Status
} from '@/components/ui/calendarx';
import { ScrollArea } from '../ui/scroll-area';

interface TeacherCalendarViewProps {
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

export function TeacherCalendarView({ teacherId }: TeacherCalendarViewProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Statuts prédéfinis pour les cours
  const statuses: Record<string, Status> = {
        upcoming: {
          id: 'upcoming',
          name: 'À venir',
          color: '#64748b' 
        },
        present: {
          id: 'present',
          name: 'Présent',
          color: '#16a34a' 
        },
        absent: {
          id: 'absent',
          name: 'Absent',
          color: '#b91c1c' 
        },
        late: {
          id: 'late',
          name: 'En retard',
          color: '#b45309' 
        }
      };
      

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`/api/schedule/${teacherId}`);
        if (!response.ok) throw new Error('Erreur lors du chargement du planning');
        
        const schedules: ScheduleEvent[] = await response.json();
        
     
        const calendarFeatures: Feature[] = schedules.map((schedule) => {
          const startDate = parseISO(schedule.startTime);
          const endDate = parseISO(schedule.endTime);
          
          return {
            id: schedule.id,
            name: `${schedule.courseName} (${format(startDate, 'HH:mm')}-${format(endDate, 'HH:mm')})`,
            startAt: startDate,
            endAt: endDate,
            status: statuses.upcoming,
            // Ajouter des métadonnées supplémentaires
            metadata: {
              roomName: schedule.roomName,
              courseId: schedule.courseId
            }
          } as Feature & { metadata: any };
        });
        
        setFeatures(calendarFeatures);
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

  return (
    <ScrollArea className=" md:max-w-full  overflow-auto ">
    <div className=" border-2 rounded-lg shadow-lg p-2">
      <CalendarProvider  startDay={1}>
        <CalendarDate>
          <CalendarDatePicker>
            <CalendarMonthPicker className='text-center mx-auto px-2 max-w-16 lg:max-w-full truncate' />
            <CalendarYearPicker className='w-fit' start={2023} end={2025} />
          </CalendarDatePicker>
          <CalendarDatePagination />
        </CalendarDate>
        
        <CalendarHeader />
        
        <CalendarBody features={features}>
          {({ feature }) => {
            const featureWithMeta = feature as Feature & { metadata: any };
            return (
              <div 
                key={feature.id} 
                className="text-xs border p-1 rounded mb-1 cursor-pointer"
                style={{ backgroundColor: `${feature.status.color}20` }}
              >
                <div className="font-medium truncate">{feature.name}</div>x
                <div className="text-gray-600 truncate"><span className='hidden  md:inline'>Salle:</span> {featureWithMeta.metadata.roomName}</div>
              </div>
            );
          }}
        </CalendarBody>
        
        <div className="flex flex-wrap gap-3 mt-4 p-2 border-t pt-3">
          {Object.values(statuses).map((status) => (
            <div key={status.id} className=" flex items-center gap-1">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: status.color }}
              />
              <span className="text-xs">{status.name}</span>
            </div>
          ))}
        </div>
      </CalendarProvider>
    </div>
    </ScrollArea>
  );
}