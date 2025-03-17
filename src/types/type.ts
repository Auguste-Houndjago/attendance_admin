export interface Teacher {
    id: string;
    name: string;
}

export interface Course {
    id: string;
    name: string;
}

export interface Room {
    id: string;
    name: string;
}

export interface AssignScheduleProps {
    teachers: Teacher[];
    courses: Course[];
    rooms: Room[];
}


