import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

// Componente Button con diferentes variantes y tamaños
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    let classes = "btn"

    // Agregar clases según la variante
    switch (variant) {
      case "default":
        classes += " btn-default"
        break
      case "ghost":
        classes += " btn-ghost"
        break
      case "destructive":
        classes += " bg-red-500 text-white"
        break
      case "outline":
        classes += " border border-gray-200 bg-white text-gray-900"
        break
      case "secondary":
        classes += " bg-gray-100 text-gray-900"
        break
      case "link":
        classes += " text-indigo-600 underline"
        break
    }

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }

    return <button className={cn(classes, sizeClasses[size], className)} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button }
