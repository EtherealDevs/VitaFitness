'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { useState, useEffect, useCallback } from 'react'
import { Student } from '../admin/students/columns'
import axios from '@/lib/axios'

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
    // Función para alternar pantalla completa
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(
                    'Error al intentar entrar en pantalla completa: ',
                    err,
                )
            })
        } else {
            document.exitFullscreen()
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 relative">
            {/* Botón de maximizar pantalla */}
            <button
                onClick={toggleFullScreen}
                className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-md hover:bg-gray-600 cursor-pointer">
                ⛶
            </button>

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
                            src="/favicon.ico"
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
                                ? `ACCESO DENEGADO ${errorMessage}`
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
interface access {
    student_id: string
    has_class_now: boolean
    is_payment_valid: boolean
    payment_date: string
    expiration_date: string
    access_granted: boolean
}
// Componente principal
export default function AccessPage() {
    const [documentNumber, setDocumentNumber] = useState<string>('')
    const [status, setStatus] = useState<AccessStatus>('pending')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [student, setStudent] = useState<Student>()
    const [access, setAccess] = useState<access>({
        student_id: '',
        has_class_now: false,
        is_payment_valid: false,
        payment_date: '',
        expiration_date: '',
        access_granted: false,
    })

    // Validación del documento (debe tener 8 dígitos)
    const handleValidation = useCallback(async (dni: string) => {
        if (!validateDocument(dni)) {
            setStatus('error')
            setErrorMessage(
                'Número de documento inválido. Debe tener 8 dígitos.',
            )
            resetAfterDelay()
            return
        }

        try {
            const studentRes = await axios.get('/api/student/search', {
                params: {
                    field: 'dni',
                    search: dni,
                },
            })

            const studentData = studentRes.data.students[0]
            if (!studentData) {
                setStatus('error')
                setErrorMessage('Estudiante no encontrado.')
                resetAfterDelay()
                return
            }

            setStudent(studentData)

            const accessRes = await axios.get(
                `/api/student/${studentData.id}/class-status`,
            )
            const accessData = accessRes.data
            setAccess(accessData)

            if (accessData.access_granted) {
                setStatus('authorized')
            } else {
                setStatus('unauthorized')

                if (!accessData.has_class_now && !accessData.is_payment_valid) {
                    setErrorMessage(
                        'No tienes clases en este momento y tu pago está vencido.',
                    )
                } else if (!accessData.has_class_now) {
                    setErrorMessage(
                        'No tienes clases programadas en este momento.',
                    )
                } else if (!accessData.is_payment_valid) {
                    setErrorMessage('El pago está vencido o no es válido.')
                }
            }

            resetAfterDelay()
        } catch (error) {
            console.error(error)
            setStatus('error')
            setErrorMessage('Error al buscar el estudiante o su acceso.')
            resetAfterDelay()
        }
    }, []) // <---- Poné dependencias si usás variables externas

    const validateDocument = (docNumber: string): boolean =>
        /^\d{8}$/.test(docNumber)

    useEffect(() => {
        if (documentNumber === '') {
            setStatus('pending')
            return
        }

        const timeout = setTimeout(() => {
            handleValidation(documentNumber)
        }, 1000)

        return () => clearTimeout(timeout)
    }, [documentNumber, handleValidation])

    const resetAfterDelay = () => {
        setTimeout(() => {
            setDocumentNumber('')
            setStatus('pending')
            setErrorMessage('')
        }, 2000)
    }
    return (
        <AccessCard
            name={student ? `${student.name} ${student.last_name}` : ''}
            paymentDate={access.expiration_date}
            status={status}
            errorMessage={errorMessage}
            documentNumber={documentNumber}
            setDocumentNumber={setDocumentNumber}
        />
        // <AccessCard
        //     name={`${student.name} ${student.lastname}`}
        //     paymentDate={payment.payment_date}
        //     status={status}
        //     errorMessage={errorMessage}
        //     documentNumber={documentNumber}
        //     setDocumentNumber={setDocumentNumber}
        // />
    )
}
