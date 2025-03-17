"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

type Course = {
  id: string
  name: string
  startDate: Date | string | null
  endDate: Date | string | null
}


const formatTime = (date: Date | string | null): string => {
  if (!date) return "00:00"

  const parsedDate = typeof date === "string" ? new Date(date) : date


  if (isNaN(parsedDate.getTime())) return "Date invalide"

  return new Intl.DateTimeFormat("default", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate)
}


export default function CourseGrid({
  courses,
  className,
}: {
  courses: Course[]
  className?: string
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", className)}>
      {courses.map((course, idx) => (
        <div
          key={course.id}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700/80 rounded-md"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>

          <div className="rounded-md cursor-pointer p-3 bg-zinc-100 dark:bg-zinc-800 group-hover:ring-1 ring-zinc-400 dark:ring-zinc-500 relative z-20 transition-all duration-300">
            <div className="z-50 relative">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{course.name}</h3>
      {course.startDate && course.endDate &&  
      
      <div className="mt-1 flex items-center justify-between text-xs">
                <div className="flex gap-1">
                  <span className="text-zinc-500 dark:text-zinc-400">Début:</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{formatTime(course.startDate)}</span>
                </div>

                <div className="flex gap-1">
                  <span className="text-zinc-500 dark:text-zinc-400">Fin:</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{formatTime(course.endDate)}</span>
                </div>
              </div>

}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

