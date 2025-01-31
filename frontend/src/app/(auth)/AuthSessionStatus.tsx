import React from 'react'

interface AuthSessionStatusProps {
    status?: string | null // Permite que status sea null
    className?: string // Propiedad opcional para la clase
    [key: string]: any // Permitir otras propiedades sin restricciones
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
