'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { useState, useEffect } from 'react'

// Estados posibles
type AccessStatus = 'authorized' | 'unauthorized' | 'pending' | 'error'

interface AccessCardProps {
    name: string
    paymentDate: string
    status: AccessStatus
    errorMessage: string
    documentNumber: string
    setDocumentNumber: (value: string) => void
}

function AccessCard({
    name,
    paymentDate,
    status,
    errorMessage,
    documentNumber,
    setDocumentNumber,
}: AccessCardProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
            {/* Fondo con gradiente */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/40 via-emerald-600/30 to-black blur-3xl" />

            {/* Mostrar título solo si está en estado "pending" */}
            {status === 'pending' && (
                <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                    Ingresa tu número de documento para verificar acceso
                </h2>
            )}

            {/* Contenido principal */}
            <div className="relative">
                <h1 className="text-4xl font-bold text-white text-center mb-6">
                    {status === 'authorized'
                        ? 'ACCESO PERMITIDO'
                        : status === 'unauthorized'
                        ? 'ACCESO DENEGADO'
                        : status === 'error'
                        ? 'ERROR'
                        : ''}
                </h1>

                {/* Modal más grande */}
                <Card
                    className={`w-[600px] bg-white rounded-3xl p-8 flex flex-col items-center space-y-6 
                    ${
                        status === 'authorized'
                            ? 'bg-emerald-400'
                            : status === 'unauthorized'
                            ? 'bg-red-500'
                            : status === 'error'
                            ? 'bg-red-700'
                            : 'bg-gray-300'
                    }`}>
                    {/* Logo */}
                    <div className="w-32 h-16 relative">
                        <Image
                            src="/img/LogoVita.png"
                            alt="VITA fitness"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Input solo si está en estado "pending" */}
                    {status === 'pending' && (
                        <div className="w-full space-y-4">
                            <label className="block text-black text-lg">
                                Número de Documento
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 rounded-md text-black border border-gray-300"
                                placeholder="Ej: 12345678"
                                value={documentNumber || ''} // Asegura que siempre tenga un valor
                                onChange={e => {
                                    // Solo permitir números
                                    const value = e.target.value
                                    if (/^\d*$/.test(value)) {
                                        setDocumentNumber(value)
                                    }
                                }}
                                inputMode="numeric" // Para dispositivos móviles
                                maxLength={8} // Limitar a 8 caracteres (ajustar según el formato)
                            />
                        </div>
                    )}

                    {/* Estado de acceso */}
                    {status !== 'pending' && (
                        <p
                            className={`text-xl font-medium ${
                                status === 'authorized'
                                    ? 'text-white'
                                    : 'text-black'
                            }`}>
                            {status === 'authorized'
                                ? 'ACCESO PERMITIDO'
                                : status === 'unauthorized'
                                ? 'ACCESO DENEGADO'
                                : errorMessage}
                        </p>
                    )}

                    {/* Nombre del miembro */}
                    {status === 'authorized' && (
                        <h2 className="text-4xl font-black tracking-wide text-center">
                            {name}
                        </h2>
                    )}

                    {/* Fecha de pago */}
                    {status === 'authorized' && (
                        <div className="text-center space-y-1">
                            <p className="text-lg font-medium">
                                FECHA DE PAGO:
                            </p>
                            <p className="text-lg font-medium">{paymentDate}</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}

// Componente principal
export default function AccessPage() {
    const [documentNumber, setDocumentNumber] = useState<string>('')
    const [status, setStatus] = useState<AccessStatus>('pending')
    const [errorMessage, setErrorMessage] = useState<string>('')

    const today = new Date()
    const lastPaymentDate = new Date('2025-03-20') // Ejemplo de fecha de pago

    // Validación del documento (debe tener 8 dígitos)
    const validateDocument = (docNumber: string): boolean =>
        /^\d{8}$/.test(docNumber)

    useEffect(() => {
        if (documentNumber === '') {
            setStatus('pending')
            return
        }

        // Espera 1 segundo antes de validar
        const timeout = setTimeout(() => {
            if (!validateDocument(documentNumber)) {
                setStatus('error')
                setErrorMessage(
                    'Número de documento inválido. Debe tener 8 dígitos.',
                )

                // Después de 2 segundos, volver al estado pendiente
                setTimeout(() => {
                    setDocumentNumber('')
                    setStatus('pending')
                    setErrorMessage('')
                }, 2000)
            } else {
                if (lastPaymentDate <= today) {
                    setStatus('authorized')

                    // Si el estado cambia a autorizado, limpiar el input después de 2 segundos
                    setTimeout(() => {
                        setDocumentNumber('')
                        setStatus('pending')
                    }, 2000)
                } else {
                    setStatus('unauthorized')
                    setErrorMessage('El pago está vencido. No tienes acceso.')
                }
            }
        }, 1000) // 1 segundo de espera

        return () => clearTimeout(timeout) // Evita validaciones innecesarias
    }, [documentNumber])

    return (
        <AccessCard
            name="SOFIA ALARCON"
            paymentDate="22 DE ABRIL"
            status={status}
            errorMessage={errorMessage}
            documentNumber={documentNumber}
            setDocumentNumber={setDocumentNumber}
        />
    )
}
