'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

// Definir los estados posibles
type AccessStatus =
    | 'authorized'
    | 'unauthorized'
    | 'pending'
    | 'loading'
    | 'error'

interface AccessCardProps {
    name: string
    paymentDate: string
    status: AccessStatus
    documentNumber: string
    onDocumentChange: (value: string) => void
    errorMessage?: string
}

function AccessCard({
    name,
    paymentDate,
    status,
    documentNumber,
    onDocumentChange,
    errorMessage,
}: AccessCardProps) {
    // Lógica para determinar el estado de autorización
    const isAuthorized = status === 'authorized'
    const isUnauthorized = status === 'unauthorized'
    const isPending = status === 'pending'
    const isLoading = status === 'loading'
    const isError = status === 'error'

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            {/* Gradient background effect */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/40 via-emerald-600/30 to-black blur-3xl" />

            {/* Main content */}
            <div className="relative">
                <h1 className="text-4xl font-bold text-white text-center mb-6">
                    {isLoading
                        ? 'Cargando...'
                        : isAuthorized
                        ? 'ACCESO PERMITIDO'
                        : isUnauthorized
                        ? 'ACCESO DENEGADO'
                        : isError
                        ? 'ERROR'
                        : 'ESTADO PENDIENTE'}
                </h1>

                <Card
                    className={`w-[400px] bg-white rounded-3xl p-8 flex flex-col items-center space-y-6 ${
                        isAuthorized
                            ? 'bg-emerald-400'
                            : isUnauthorized
                            ? 'bg-red-500'
                            : isPending
                            ? 'bg-yellow-500'
                            : isError
                            ? 'bg-red-700'
                            : 'bg-gray-300'
                    }`}>
                    {/* Logo */}
                    <div className="w-32 h-16 relative">
                        <Image
                            src="/placeholder.svg"
                            alt="VITA fitness"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Input for document number */}
                    <div className="w-full space-y-4">
                        <label className="block text-white text-lg">
                            Número de Documento
                        </label>
                        <input
                            type="text"
                            value={documentNumber}
                            onChange={e => onDocumentChange(e.target.value)}
                            className="w-full p-2 rounded-md text-black"
                            placeholder="Ingresa tu número de documento"
                        />
                    </div>

                    {/* Error message */}
                    {isError && errorMessage && (
                        <p className="text-red-500 text-sm mt-2">
                            {errorMessage}
                        </p>
                    )}

                    {/* Access status */}
                    <p
                        className={`text-xl font-medium ${
                            isAuthorized
                                ? 'text-white'
                                : isUnauthorized
                                ? 'text-white'
                                : 'text-black'
                        }`}>
                        {isLoading
                            ? 'Verificando...'
                            : isAuthorized
                            ? 'ACCESO PERMITIDO'
                            : isUnauthorized
                            ? 'ACCESO DENEGADO'
                            : isError
                            ? 'ERROR EN EL DOCUMENTO'
                            : 'ESTADO PENDIENTE'}
                    </p>

                    {/* Member name */}
                    <h2 className="text-4xl font-black tracking-wide text-center">
                        {name}
                    </h2>

                    {/* Payment date */}
                    <div className="text-center space-y-1">
                        <p className="text-lg font-medium">FECHA DE PAGO:</p>
                        <p className="text-lg font-medium">{paymentDate}</p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

// Componente principal para determinar el estado de la autorización
export default function AccessPage() {
    const [documentNumber, setDocumentNumber] = useState('')
    const [status, setStatus] = useState<AccessStatus>('loading')
    const [errorMessage, setErrorMessage] = useState<string>('')

    const today = new Date()

    // Simulamos la lógica de autorización basada en la fecha de pago
    const lastPaymentDate = new Date('2025-03-20') // Esta debería ser la fecha de pago real

    // Lógica de verificación del documento (solo un ejemplo de validación)
    const validateDocument = (docNumber: string): boolean => {
        // Validación simple, por ejemplo, longitud del documento
        return docNumber.length === 8
    }

    const handleDocumentChange = (value: string) => {
        setDocumentNumber(value)
        // Cambiar estado a "loading" mientras validamos el documento
        setStatus('loading')
        setErrorMessage('') // Reseteamos el mensaje de error

        if (validateDocument(value)) {
            // Si el documento es válido, calculamos el estado
            setTimeout(() => {
                if (lastPaymentDate <= today) {
                    setStatus('authorized')
                } else {
                    setStatus('unauthorized')
                }
            }, 1500)
        } else {
            // Si el documento no es válido
            setStatus('error')
            setErrorMessage('El número de documento no es válido.')
        }
    }

    return (
        <AccessCard
            name="SOFIA ALARCON"
            paymentDate="22 DE ABRIL"
            status={status}
            documentNumber={documentNumber}
            onDocumentChange={handleDocumentChange}
            errorMessage={errorMessage}
        />
    )
}
