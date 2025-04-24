'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ClassSchedule, usePayments } from '@/hooks/payments'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/app/admin/components/ui/button'
import { useStudents } from '@/hooks/students'
import axios from '@/lib/axios'
import type { Student } from '@/app/admin/students/columns'

import Image from 'next/image'

export default function ShowPayment() {
    const router = useRouter()
    const { getPayment } = usePayments()
    const [students, setStudents] = useState<Student[]>([])
    const [loadingData, setLoadingData] = useState(false)
    const { getStudents } = useStudents()

    const [payment, setPayment] = useState({
        id: '',
        student_id: '',
        classSchedule_id: '',
        classSchedule: null as ClassSchedule | null,
        amount: '',
        status: '',
        date_start: '',
        payment_date: '',
        expiration_date: '',
        student: null as Student | null,
        comprobante: '',
    })

    const { id } = useParams() as { id: string }

    const getFileType = (url: string) => {
        if (!url) return ''

        // Verificar por extensiones comunes en la URL
        const lowerUrl = url.toLowerCase()
        if (lowerUrl.endsWith('.pdf')) return 'pdf'
        if (
            lowerUrl.endsWith('.jpg') ||
            lowerUrl.endsWith('.jpeg') ||
            lowerUrl.endsWith('.png') ||
            lowerUrl.endsWith('.gif')
        )
            return 'image'

        // Si no hay extensión clara, intentar inferir por el nombre o estructura
        if (lowerUrl.includes('pdf')) return 'pdf'

        // Por defecto, asumir que es una imagen
        return 'image'
    }

    const fetchStudents = useCallback(async () => {
        try {
            const response = await getStudents()
            setStudents(response.students)
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [getStudents])

    useEffect(() => {
        setLoadingData(true)

        if (id) {
            getPayment(id)
                .then(data => {
                    setPayment({
                        id: data.payment.id,
                        student_id: data.payment.student_id,
                        classSchedule_id: data.payment.classSchedule_id,
                        classSchedule: data.payment.classSchedule || null,
                        amount: data.payment.amount,
                        status: data.payment.status,
                        date_start: data.payment.date_start,
                        payment_date: data.payment.payment_date,
                        expiration_date: data.payment.expiration_date,
                        student: data.payment.student || null,
                        comprobante: data.payment.comprobante || '',
                    })
                })
                .catch(console.error)
        }

        fetchStudents().catch(console.error)
        setLoadingData(false)
    }, [id, getPayment, fetchStudents])

    const handleEdit = () => {
        router.push(`/admin/payments/edit/${id}`)
    }

    const handleBack = () => {
        router.push('/admin/payments')
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '---'
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }
    const handleDownloadComprobante = async () => {
        if (!payment.comprobante) {
            alert('No hay comprobante disponible para descargar.')
            return
        }

        try {
            const filename = payment.comprobante.split('/').pop()
            if (!filename) throw new Error('Nombre de archivo no válido.')

            const response = await axios.get(
                `/api/comprobante/download/${filename}`,
            )
            console.log('response', response)
            // if (!response.ok) {
            //     throw new Error('Error al descargar el comprobante.')
            // }

            // const blob = await response.blob()
            // const blobUrl = URL.createObjectURL(blob)

            // const link = document.createElement('a')
            // link.href = blobUrl
            // link.download = filename
            // document.body.appendChild(link)
            // link.click()
            // document.body.removeChild(link)
            // URL.revokeObjectURL(blobUrl)
        } catch (error) {
            console.error('Error en la descarga del comprobante:', error)
            alert('Ocurrió un error al intentar descargar el comprobante.')
        }
    }

    if (loadingData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4">Cargando detalles del pago...</p>
                </div>
            </div>
        )
    }

    const studentName = payment.student
        ? `${payment.student.name} ${payment.student.last_name}`
        : students.find(s => s.id === payment.student_id)
        ? `${students.find(s => s.id === payment.student_id)?.name} ${
              students.find(s => s.id === payment.student_id)?.last_name
          }`
        : '---'
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Detalles del pago</h1>
                <div className="space-x-2">
                    <Button variant="outline" onClick={handleBack}>
                        Volver
                    </Button>
                    <Button onClick={handleEdit}>Editar</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información del Pago</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    ID del Pago
                                </h3>
                                <p className="text-lg font-medium">
                                    {payment.id}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Alumno
                                </h3>
                                <p className="text-lg font-medium">
                                    {studentName}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Clase
                                </h3>
                                <p className="text-lg font-medium">
                                    {payment.classSchedule
                                        ? `Clase  ${
                                              payment.classSchedule.class.name
                                          } - Hora: ${
                                              payment.classSchedule
                                                  .time_start ?? '---'
                                          } a  ${
                                              payment.classSchedule.time_end ??
                                              '---'
                                          }`
                                        : '---'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Monto
                                </h3>
                                <p className="text-lg font-medium">
                                    ${payment.amount}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Estado
                                </h3>
                                <div className="mt-1">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            payment.status === 'Pagado' ||
                                            payment.status === 'pagado'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                : payment.status ===
                                                      'Pendiente' ||
                                                  payment.status === 'pendiente'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                        }`}>
                                        {payment.status || '---'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Fecha de inicio
                                </h3>
                                <p className="text-lg font-medium">
                                    {formatDate(payment.date_start)}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Fecha de pago
                                </h3>
                                <p className="text-lg font-medium">
                                    {formatDate(payment.payment_date)}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Fecha de expiración
                                </h3>
                                <p className="text-lg font-medium">
                                    {formatDate(payment.expiration_date)}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {payment.comprobante && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Comprobante de Pago</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {getFileType(payment.comprobante) === 'pdf' ? (
                                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-red-500">
                                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <path d="M9 15v-2h6v2" />
                                                <path d="M11 13v4" />
                                                <path d="M9 19h6" />
                                            </svg>
                                            <span>Documento PDF</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    window.open(
                                                        payment.comprobante,
                                                        '_blank',
                                                    )
                                                }>
                                                Ver
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={
                                                    handleDownloadComprobante
                                                }>
                                                Descargar comprobante
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="border rounded-lg overflow-hidden">
                                        <Image
                                            src={
                                                payment.comprobante ||
                                                '/placeholder.svg'
                                            }
                                            alt="Comprobante de pago"
                                            width={500}
                                            height={500}
                                            className="w-full h-[500px] object-cover"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => {
                                                const link =
                                                    document.createElement('a')
                                                link.href = payment.comprobante
                                                link.download = `comprobante-pago-${payment.id}.jpg`
                                                document.body.appendChild(link)
                                                link.click()
                                                document.body.removeChild(link)
                                            }}>
                                            Descargar Comprobante
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {!payment.comprobante && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Comprobante de Pago</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mx-auto text-muted-foreground mb-4">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <line x1="10" y1="9" x2="8" y2="9" />
                            </svg>
                            <p className="text-muted-foreground">
                                No hay comprobante disponible para este pago
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
