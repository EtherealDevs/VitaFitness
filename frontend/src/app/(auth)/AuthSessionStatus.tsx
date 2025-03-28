'use client'
import type React from 'react'

interface AuthSessionStatusProps extends React.HTMLAttributes<HTMLDivElement> {
    status?: string | null
    className?: string
}

const AuthSessionStatus: React.FC<AuthSessionStatusProps> = ({
    status,
    className,
    ...props
}) => (
    <>
        {status && (
            <div
                className={`${className} font-medium text-sm text-green-600`}
                {...props}>
                {status}
            </div>
        )}
    </>
)

export default AuthSessionStatus
