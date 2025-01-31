import type React from "react"

interface GradientTitleProps {
  children: React.ReactNode
  className?: string
}

export function GradientTitle({ children, className = "" }: GradientTitleProps) {
  return <h2 className={`text-4xl impact-title gradient-underline mb-8 ${className}`}>{children}</h2>
}

