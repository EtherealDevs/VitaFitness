'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { useState, useEffect } from 'react'
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

    // funtion search student for dni

    const fetchStudent = async (dni: string) => {
        try {
            const res = await axios.get('/api/student/search', {
                params: {
                    field: 'dni',
                    search: dni,
                },
            })
            setStudent(res.data.students[0])
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const fetchAccess = async (id: string) => {
        try {
            const res = await axios.get(`/api/student/${id}/class-status`)
            setAccess(res.data)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

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
                // Llamar a la función para buscar el estudiante
                fetchStudent(documentNumber)
                // Llamar a la función para obtener el acceso si existe estudiante
                console.log(student)
                if (student) {
                    fetchAccess(student.id)
                }

                if (access.access_granted) {
                    setStatus('authorized')

                    // Si el estado cambia a autorizado, limpiar el input después de 2 segundos
                    setTimeout(() => {
                        setDocumentNumber('')
                        setStatus('pending')
                    }, 2000)
                } else {
                    setStatus('unauthorized')
                    if (!access.has_class_now && !access.is_payment_valid) {
                        setErrorMessage(
                            'No tienes clases en este momento y tu pago está vencido.',
                        )
                    } else if (!access.has_class_now) {
                        setErrorMessage(
                            'No tienes clases programadas en este momento.',
                        )
                    } else if (!access.is_payment_valid) {
                        setErrorMessage('El pago está vencido o no es válido.')
                    }
                }
                setTimeout(() => {
                    setDocumentNumber('')
                    setStatus('pending')
                    setErrorMessage('')
                }, 2000)
            }
        }, 1000) // 1 segundo de espera

        return () => clearTimeout(timeout) // Evita validaciones innecesarias
    }, [documentNumber])

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
