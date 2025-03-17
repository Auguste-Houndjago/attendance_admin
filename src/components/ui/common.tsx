import { cn } from "@/lib/utils"

export const PageHeader = ({ 
  title, 
  description 
}: { 
  title: string
  description?: string 
}) => (
  <div className="space-y-2 mb-8">
    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
    {description && (
      <p className="text-muted-foreground">{description}</p>
    )}
  </div>
)

export const Card = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) => (
  <div className={cn(
    "bg-white dark:bg-zinc-900 rounded-xl shadow-soft p-6",
    className
  )}>
    {children}
  </div>
) 