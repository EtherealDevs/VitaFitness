'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { useState, useEffect, useCallback, useRef } from 'react'
import type { Student } from '../admin/students/columns'
import axios from '@/lib/axios'
import { Search, Maximize2, X, Check } from 'lucide-react'

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
    const inputRef = useRef<HTMLInputElement>(null)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // Función para alternar pantalla completa manualmente
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            try {
                // Intentar con el método estándar
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(
                        'Error al intentar entrar en pantalla completa: ',
                        err,
                    )

                    // Intentar con métodos específicos de navegadores
                    const docEl = document.documentElement as HTMLElement & {
                        mozRequestFullScreen?: () => Promise<void>
                        webkitRequestFullscreen?: () => Promise<void>
                        msRequestFullscreen?: () => Promise<void>
                    }

                    if (docEl.mozRequestFullScreen) {
                        docEl.mozRequestFullScreen()
                    } else if (docEl.webkitRequestFullscreen) {
                        docEl.webkitRequestFullscreen()
                    } else if (docEl.msRequestFullscreen) {
                        docEl.msRequestFullscreen()
                    }
                })
            } catch (error) {
                console.error(
                    'Error al intentar entrar en pantalla completa:',
                    error,
                )
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else {
                const doc = document as Document & {
                    mozCancelFullScreen?: () => Promise<void>
                    webkitExitFullscreen?: () => Promise<void>
                    msExitFullscreen?: () => Promise<void>
                }

                if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen()
                } else if (doc.webkitExitFullscreen) {
                    doc.webkitExitFullscreen()
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen()
                }
            }
        }
    }

    useEffect(() => {
        if (status === 'pending' && inputRef.current) {
            inputRef.current.focus()
        }
    }, [status])

    const formattedTime = currentTime.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })

    const formattedDate = currentTime.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="min-h-screen max-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-start pt-16 relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
            </div>

            {/* Botón de maximizar pantalla */}
            <button
                onClick={toggleFullScreen}
                className="fixed top-4 right-4 z-50 bg-slate-800/80 text-white p-2.5 rounded-full hover:bg-slate-700 transition-colors duration-200 backdrop-blur-sm border border-slate-700/50 shadow-lg">
                <Maximize2 size={20} />
            </button>

            {/* Reloj y fecha */}
            <div className="relative z-10 text-center mb-12">
                <p className="text-8xl font-bold text-white tracking-tight drop-shadow-lg">
                    {formattedTime}
                </p>
                <p className="text-xl text-white/80 mt-1 font-medium">
                    {formattedDate}
                </p>
            </div>

            {/* Título de estado */}
            <div className="relative z-10 h-16 mb-6">
                {status === 'pending' && (
                    <h2 className="text-2xl font-medium text-white/90 text-center">
                        Ingresa tu número de documento para verificar acceso
                    </h2>
                )}
                {status !== 'pending' && (
                    <h1
                        className={`text-4xl font-bold text-center ${
                            status === 'authorized'
                                ? 'text-emerald-400'
                                : 'text-red-400'
                        }`}>
                        {status === 'authorized'
                            ? 'ACCESO PERMITIDO'
                            : status === 'unauthorized'
                            ? 'ACCESO DENEGADO'
                            : 'ERROR'}
                    </h1>
                )}
            </div>

            {/* Tarjeta principal */}
            <Card
                className={`w-[600px] rounded-2xl p-8 flex flex-col items-center space-y-6 shadow-2xl backdrop-blur-sm border-2 transition-all duration-300 ${
                    status === 'authorized'
                        ? 'bg-emerald-500/90 border-emerald-400'
                        : status === 'unauthorized' || status === 'error'
                        ? 'bg-red-500/90 border-red-400'
                        : 'bg-white/90 border-slate-200'
                }`}>
                {/* Logo */}
                <div className="w-24 h-24 relative bg-white rounded-full p-2 shadow-md">
                    <Image
                        src="/favicon.ico"
                        alt="VITA fitness"
                        fill
                        className="object-contain p-2"
                        priority
                    />
                </div>

                {/* Campo de documento */}
                <div className="w-full space-y-3">
                    <label
                        className={`block text-lg text-center font-medium ${
                            status === 'authorized' ||
                            status === 'unauthorized' ||
                            status === 'error'
                                ? 'text-white'
                                : 'text-slate-700'
                        }`}>
                        Número de Documento
                    </label>
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            className={`w-full p-4 pr-12 rounded-xl text-slate-800 border-2 text-center text-2xl font-bold shadow-sm focus:outline-none focus:ring-2 transition-all ${
                                status === 'authorized'
                                    ? 'border-emerald-300 focus:ring-emerald-300'
                                    : status === 'unauthorized' ||
                                      status === 'error'
                                    ? 'border-red-300 focus:ring-red-300'
                                    : 'border-slate-200 focus:ring-emerald-500'
                            }`}
                            placeholder="Ej: 12345678"
                            value={documentNumber || ''}
                            onChange={e => {
                                const value = e.target.value
                                if (/^\d*$/.test(value)) {
                                    setDocumentNumber(value)
                                }
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    inputRef.current?.blur()
                                }
                            }}
                            inputMode="numeric"
                            maxLength={8}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={20} />
                        </div>
                    </div>
                </div>

                {/* Mensaje de estado */}
                {status !== 'pending' && (
                    <div
                        className={`flex items-center justify-center gap-2 text-xl font-medium ${
                            status === 'authorized' ||
                            status === 'unauthorized' ||
                            status === 'error'
                                ? 'text-white'
                                : 'text-slate-700'
                        }`}>
                        {status === 'authorized' ? (
                            <Check className="text-white" size={24} />
                        ) : (
                            <X className="text-white" size={24} />
                        )}
                        <p>
                            {status === 'authorized'
                                ? 'ACCESO PERMITIDO'
                                : status === 'unauthorized'
                                ? `ACCESO DENEGADO ${errorMessage}`
                                : errorMessage}
                        </p>
                    </div>
                )}

                {/* Nombre del estudiante */}
                {status === 'authorized' && (
                    <h2 className="text-4xl font-black tracking-wide text-center text-white mt-2">
                        {name}
                    </h2>
                )}

                {/* Fecha de pago */}
                {status === 'authorized' && (
                    <div className="text-center space-y-1 bg-white/20 px-6 py-3 rounded-xl backdrop-blur-sm">
                        <p className="text-lg font-medium text-white">
                            FECHA DE PAGO:
                        </p>
                        <p className="text-lg font-bold text-white">
                            {paymentDate}
                        </p>
                    </div>
                )}
            </Card>

            {/* Instrucciones adicionales */}
            {status === 'pending' && (
                <div className="mt-8 text-white/60 text-center max-w-md">
                    <p>
                        Ingresa tu DNI y presiona Enter para verificar tu acceso
                    </p>
                </div>
            )}
        </div>
    )
}

interface access {
    student_id: string
    has_class_now?: boolean
    is_payment_valid: boolean
    payment_date: string
    expiration_date: string
    access_granted: boolean
}

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

    const validateDocument = (docNumber: string): boolean =>
        /^\d{8}$/.test(docNumber)

    const handleValidation = useCallback(async (dni: string) => {
        if (!validateDocument(dni)) {
            setStatus('error')
            setErrorMessage(
                'Número de documento inválido. Debe tener 8 dígitos.',
            )

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

                if (!accessData.is_payment_valid) {
                    setErrorMessage('El pago está vencido o no es válido.')
                }
            }
        } catch (error) {
            console.error(error)
            setStatus('error')
            setErrorMessage('Error al buscar el estudiante o su acceso.')
        }
    }, [])

    useEffect(() => {
        // Si el input está vacío, resetea todo
        if (documentNumber === '') {
            setStatus('pending')
            setErrorMessage('')
            setStudent(undefined)
            setAccess({
                student_id: '',
                has_class_now: false,
                is_payment_valid: false,
                payment_date: '',
                expiration_date: '',
                access_granted: false,
            })
            return
        }

        // Al cambiar el DNI, también resetea todo antes de validar
        setStatus('pending')
        setErrorMessage('')
        setStudent(undefined)
        setAccess({
            student_id: '',
            has_class_now: false,
            is_payment_valid: false,
            payment_date: '',
            expiration_date: '',
            access_granted: false,
        })

        const timeout = setTimeout(() => {
            handleValidation(documentNumber)
        }, 1000)

        return () => clearTimeout(timeout)
    }, [documentNumber, handleValidation])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const shouldGoFullscreen = params.get('fullscreen') === 'true'

        const enterFullScreen = () => {
            const elem = document.documentElement

            if (!document.fullscreenElement && elem.requestFullscreen) {
                elem.requestFullscreen().catch(err => {
                    console.warn('No se pudo entrar en pantalla completa:', err)
                })
            }
        }

        // Ejecutar al cargar
        if (shouldGoFullscreen) {
            setTimeout(() => {
                enterFullScreen()
            }, 300)
        }

        // Fallback: primer interacción del usuario
        const handleInteraction = () => {
            if (shouldGoFullscreen) {
                enterFullScreen()
            }
            document.removeEventListener('click', handleInteraction)
            document.removeEventListener('keydown', handleInteraction)
        }

        document.addEventListener('click', handleInteraction)
        document.addEventListener('keydown', handleInteraction)

        return () => {
            document.removeEventListener('click', handleInteraction)
            document.removeEventListener('keydown', handleInteraction)
        }
    }, [])

    return (
        <AccessCard
            name={student ? `${student.name} ${student.last_name}` : ''}
            paymentDate={access.expiration_date}
            status={status}
            errorMessage={errorMessage}
            documentNumber={documentNumber}
            setDocumentNumber={setDocumentNumber}
        />
    )
}
