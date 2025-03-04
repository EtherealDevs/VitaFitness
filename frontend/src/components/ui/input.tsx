import type React from "react"
import { type ChangeEvent, forwardRef } from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  type: string
  name: string
  value: string
  className?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  autoFocus?: boolean
  autoComplete?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ autoComplete, ...props }, ref) => {
  return <input ref={ref} autoComplete={autoComplete} {...props} />
})

Input.displayName = "Input"
export default Input