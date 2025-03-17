import { FloatingSidebar } from "@/components/ux/FloatingSidebar"

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="flex">
        <FloatingSidebar />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
