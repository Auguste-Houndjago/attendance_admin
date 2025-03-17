import { format } from "date-fns"
import { Clock, User, MapPin } from "lucide-react"

interface EventInfoProps {
  eventInfo: {
    event: {
      start: Date
      end: Date
    }
  }
  course?: {
    name: string
    abbreviation?: string
  }
  teacher?: {
    name: string
  }
  room?: {
    name: string
  }
}

export default function CalendarEventDisplay({ eventInfo, course, teacher, room }: EventInfoProps) {
  return (
    <div className="p-2 h-full rounded-md bg-white dark:bg-gray-800 border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Header with course info */}
      <div className="mb-1.5">
        <h3 className="font-bold text-sm line-clamp-2 text-gray-900 dark:text-gray-100">{course?.name}</h3>
        {course?.abbreviation && (
          <div className="text-xs font-medium text-primary/80 -mt-0.5">{course.abbreviation}</div>
        )}
      </div>

      {/* Time info with icon */}
      <div className="flex items-center text-xs text-gray-700 dark:text-gray-300 mb-1">
        <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
        <span>
          {format(eventInfo.event.start, "HH:mm")} - {format(eventInfo.event.end, "HH:mm")}
        </span>
      </div>

      {/* Teacher info with icon */}
      {teacher && (
        <div className="flex items-center text-xs text-gray-700 dark:text-gray-300 mb-1">
          <User className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">{teacher.name}</span>
        </div>
      )}

      {/* Room info with icon */}
      {room && (
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">{room.name}</span>
        </div>
      )}
    </div>
  )
}

