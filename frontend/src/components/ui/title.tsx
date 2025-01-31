import type React from "react"

interface TitleProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4"
}

export function Title({ children, className = "", as: Component = "h2" }: TitleProps) {
  return <Component className={`impact-title ${className}`}>{children}</Component>
}

