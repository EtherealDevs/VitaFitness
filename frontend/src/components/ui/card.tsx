import React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'bg-white dark:bg-zinc-950 rounded-lg shadow-md overflow-hidden',
            className,
        )}
        {...props}>
        {children}
    </div>
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
    />
))
CardHeader.displayName = 'CardHeader'

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('p-6 border-t border-gray-200', className)}
        {...props}
    />
))
CardFooter.displayName = 'CardFooter'

const CardTitle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn(
            'text-xl font-bold text-gray-900 dark:text-white',
            className,
        )}
        {...props}>
        {children}
    </h2>
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-gray-600 text-sm', className)} {...props}>
        {children}
    </p>
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props}>
        {children}
    </div>
))
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
