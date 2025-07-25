import type * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

// Componente Badge para mostrar etiquetas
function Badge({ className, variant = "default", ...props }: BadgeProps) {
  let classes = "badge"

  switch (variant) {
    case "default":
      classes += " bg-gray-900 text-white"
      break
    case "secondary":
      classes += " badge-secondary"
      break
    case "destructive":
      classes += " bg-red-500 text-white"
      break
    case "outline":
      classes += " badge-outline"
      break
  }

  return <div className={cn(classes, className)} {...props} />
}

export { Badge }
