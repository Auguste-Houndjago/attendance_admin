// import { Course, ScheduleEvent, Teacher } from '@/types/type';
// import { addDays, addHours, format, startOfWeek } from 'date-fns';

// // Generate random color
// const getRandomColor = () => {
//   const colors = [
//     '#4CAF50', // Green
//     '#2196F3', // Blue
//     '#FF9800', // Orange
//     '#9C27B0', // Purple
//     '#F44336', // Red
//     '#009688', // Teal
//     '#673AB7', // Deep Purple
//     '#3F51B5', // Indigo
//     '#E91E63', // Pink
//     '#00BCD4', // Cyan
//   ];
//   return colors[Math.floor(Math.random() * colors.length)];
// };

// // Mock teacher data
// export const mockTeacher: Teacher = {
//   id: 'teacher-1',
//   name: 'Dr. Thomas Laurent',
//   email: 'thomas.laurent@universite.fr',
//   avatar_url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150&q=80',
//   courses: [],
//   role: 'TEACHER'
// };

// // Mock courses data
// export const mockCourses: Course[] = [
//   {
//     id: '1',
//     name: 'Mathématiques',
//     abbreviation: 'MATH',
//     startDate: '2025-01-10',
//     endDate: '2025-05-15',
//     color: getRandomColor(),
//   },
//   {
//     id: '2',
//     name: 'Physique',
//     abbreviation: 'PHY',
//     startDate: '2025-01-12',
//     endDate: '2025-05-20',
//     color: getRandomColor(),
//   },
//   {
//     id: '3',
//     name: 'Informatique',
//     abbreviation: 'INFO',
//     startDate: '2025-01-15',
//     endDate: '2025-05-25',
//     color: getRandomColor(),
//   },
//   {
//     id: '4',
//     name: 'Anglais',
//     abbreviation: 'ENG',
//     startDate: '2025-01-18',
//     endDate: '2025-05-10',
//     color: getRandomColor(),
//   },
//   {
//     id: '5',
//     name: 'Économie',
//     abbreviation: 'ECO',
//     startDate: '2025-01-20',
//     endDate: '2025-05-18',
//     color: getRandomColor(),
//   },
//   {
//     id: '6',
//     name: 'Chimie',
//     abbreviation: 'CHIM',
//     startDate: '2025-01-22',
//     endDate: '2025-05-22',
//     color: getRandomColor(),
//   },
// ];

// // Generate teacher schedule for a week
// const today = new Date();
// const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday

// export const mockEvents: ScheduleEvent[] = [
//   // Monday
//   {
//     id: 'event-1',
//     title: 'Mathématiques',
//     start: addHours(weekStart, 9).toISOString(),
//     end: addHours(weekStart, 11).toISOString(),
//     extendedProps: {
//       abbreviation: 'MATH',
//       courseId: '1',
//       status: 'PRESENT',
//       teacherId: mockTeacher.id
//     },
//     backgroundColor: mockCourses[0].color,
//     borderColor: mockCourses[0].color,
//   },
//   {
//     id: 'event-2',
//     title: 'Physique',
//     start: addHours(weekStart, 13).toISOString(),
//     end: addHours(weekStart, 15).toISOString(),
//     extendedProps: {
//       abbreviation: 'PHY',
//       courseId: '2',
//       status: 'PRESENT',
//       teacherId: mockTeacher.id
//     },
//     backgroundColor: mockCourses[1].color,
//     borderColor: mockCourses[1].color,
//   },
  
//   // Tuesday
//   {
//     id: 'event-3',
//     title: 'Informatique',
//     start: addHours(addDays(weekStart, 1), 10).toISOString(),
//     end: addHours(addDays(weekStart, 1), 12).toISOString(),
//     extendedProps: {
//       abbreviation: 'INFO',
//       courseId: '3',
//       status: 'ABSENT', // Absent for this class
//       teacherId: mockTeacher.id
//     },
//     backgroundColor: mockCourses[2].color,
//     borderColor: mockCourses[2].color,
//   },
  
//   // Wednesday
//   {
//     id: 'event-4',
//     title: 'Mathématiques',
//     start: addHours(addDays(weekStart, 2), 9).toISOString(),
//     end: addHours(addDays(weekStart, 2), 11).toISOString(),
//     extendedProps: {
//       abbreviation: 'MATH',
//       courseId: '1',
//       status: 'PRESENT',
//       teacherId: mockTeacher.id
//     },
//     backgroundColor: mockCourses[0].color,
//     borderColor: mockCourses[0].color,
//   },
//   {
//     id: 'event-5',
//     title: 'Anglais',
//     start: addHours(addDays(weekStart, 2), 14).toISOString(),
//     end: addHours(addDays(weekStart, 2), 16).toISOString(),
//     extendedProps: {
//       abbreviation: 'ENG',
//       courseId: '4',
//       status: 'LATE', // Late for this class
//       teacherId: mockTeacher.id
//     },
//     backgroundColor: mockCourses[3].color,
//     borderColor: mockCourses[3].color,
//   },
  
//   // Thursday
//   {
//     id: 'event-6',
//     title: 'Économie',
//     start: addHours(addDays(weekStart, 3), 11).toISOString(),
//     end: addHours(addDays(weekStart, 3), 13).toISOString(),
//     extendedProps: {
//       abbreviation: 'ECO',
//       courseId: '5',
//       status: 'PRESENT',
//       teacherId: mockTeacher.id
//     },
//     backgroundColor: mockCourses[4].color,
//     borderColor: mockCourses[4].color,
//   },
  
//   // Friday
//   {
//     id: 'event-7',
//     title: 'Chimie',
//     start: addHours(addDays(weekStart, 4), 9).toISOString(),
//     end: addHours(addDays(weekStart, 4), 11).toISOString(),
//     extendedProps: {
//       abbreviation: 'CHIM',
//       courseId: '6',
//       status: 'ABSENT', // Absent for this class
//       teacherId: mockTeacher.id
//     },
//     backgroundColor: mockCourses[5].color,
//     borderColor: mockCourses[5].color,
//   },
//   {
//     id: 'event-8',
//     title: 'Physique',
//     start: addHours(addDays(weekStart, 4), 14).toISOString(),
//     end: addHours(addDays(weekStart, 4), 16).toISOString(),
//     extendedProps: {
//       abbreviation: 'PHY',
//       courseId: '2',
//       status: 'PRESENT',
//       teacherId: mockTeacher.id
//     },
//     backgroundColor: mockCourses[1].color,
//     borderColor: mockCourses[1].color,
//   },
// ];