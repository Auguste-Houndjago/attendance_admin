export interface Course {
  id: string;
  name: string;
  abbreviation?: string;
  startDate: string;
  endDate?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface Room {
  id: string;
  name: string;
  size?: 'SMALL' | 'MEDIUM' | 'LARGE';
  locationId?: string | null
  location?: {
    name: string
    address: string
  }
}

export interface Schedule {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  teacherId: string;
  courseId: string;
  roomId: string;
  course: Course;
  room: Room;
  attendances: Attendance[];
}

export interface ScheduleEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    courseId: string;
    roomId?: string;
    abbreviation?: string;
  };
  backgroundColor?: string;
  borderColor?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    courseId: string;
    roomId: string;
    teacherId?: string;
  };
}

// Type pour le renderer d'événement
export interface EventInfo {
  event: CalendarEvent;
}

export interface ScheduleViewProps {
  selectedDate: Date;
}

export interface AttendanceSchedule {
  id: string;
  course: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    name: string;
  };
  room: {
    id: string;
    name: string;
    location?: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
      radius: number;
    };
  };
  startTime: string | Date;
  endTime: string | Date;
  attendance?: {
    status: "PRESENT" | "ABSENT" | "LATE";
    confirmed: boolean;
    notes?: string;
    timestamp: string | Date;
  } | null;
}

export type ViewMode = "grid" | "list";
export type SortField = "course" | "teacher" | "time" | "status";
export type SortOrder = "asc" | "desc";

export type ChipColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';

export interface Attendance {
  id: string;
  teacherId: string;
  scheduleId: string;
  status: string;
  createdAt: Date;
} 