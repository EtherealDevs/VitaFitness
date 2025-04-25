'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePayments } from '@/hooks/payments'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/app/admin/components/ui/input'
import { Label } from '@/app/admin/components/ui/label'
import { Button } from '@/app/admin/components/ui/button'
import { useStudents } from '@/hooks/students'
import axios from '@/lib/axios'
import { Student } from '@/app/admin/students/columns'
import { Class } from '@/hooks/classes'
import { Schedule } from '@/hooks/schedules'

interface ClassSchedules {
    id: string
    class: Class
    schedule: Schedule
    scheduleTimeslot: { hour: string }
    students: string[]
}

export default function EditPayment() {
    const router = useRouter()
    const { getPayment, updatePayment } = usePayments()
    const [students, setStudents] = useState<Student[]>([])
    const [classSchedule, setClassSchedule] = useState<ClassSchedules[]>([])
    const [selectedClass, setSelectedClass] = useState<ClassSchedules | null>(
        null,
    )
    const [loadingData, setLoadingData] = useState(false)
    const { getStudents } = useStudents()

    const [form, setForm] = useState({
        student_id: '',
        classSchedule_id: '',
        amount: '',
        status: '',
        date_start: '',
        payment_date: '',
        expiration_date: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { id } = useParams() as { id: string }
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value,
        }))
        if (name === 'student_id') {
            fetchClassSchedule(value)
        }
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
    const fetchClassSchedule = useCallback(async (id: string) => {
        try {
            const response = await axios.get(`/api/class/students/${id}`)
            setClassSchedule(response.data.classScheduleTimeslotStudent)
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    useEffect(() => {
        setLoadingData(true)

        if (id) {
            getPayment(id)
                .then(data => {
                    setForm({
                        student_id: data.payment.student_id,
                        classSchedule_id: data.payment.classSchedule_id,
                        amount: data.payment.amount,
                        status: data.payment.status,
                        date_start: data.payment.date_start,
                        payment_date: data.payment.payment_date,
                        expiration_date: data.payment.expiration_date,
                    })

                    // ⚠️ Traer las clases correspondientes después de setear el estudiante
                    if (data.payment.student_id) {
                        fetchClassSchedule(data.payment.student_id)
                    }
                })
                .catch(console.error)
        }

        fetchStudents().catch(console.error)
    }, [id, getPayment, fetchClassSchedule, fetchStudents])

    useEffect(() => {
        try {
            const selected = classSchedule.find(
                s => s.id === form.classSchedule_id,
            )
            setSelectedClass(selected ?? null)
        } finally {
            setLoadingData(false)
        }
    }, [classSchedule, form.classSchedule_id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData()
        console.log('schedule', form.classSchedule_id)
        console.log('student', form.student_id)
        formData.append('student_id', form.student_id)
        formData.append('classSchedule_id', form.classSchedule_id as string)
        formData.append('amount', form.amount)
        formData.append('status', form.status)
        formData.append('date_start', form.date_start)
        formData.append('payment_date', form.payment_date)
        formData.append('expiration_date', form.expiration_date)

        try {
            if (!id) throw new Error('ID inválido')
            await updatePayment(id, formData)
            router.push('/admin/payments')
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Error al actualizar el pago')
            }
        } finally {
            setLoading(false)
        }
    }
    if (loadingData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4">Cargando pago...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Editar pago</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Modificar Pago</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Alumno</Label>
                                <select
                                    name="student_id"
                                    value={form.student_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-300 bg-white dark:bg-[#393d40] text-black dark:text-white">
                                    <option value="">Seleccionar alumno</option>
                                    {students.map(student => (
                                        <option
                                            key={student.id}
                                            value={student.id}>
                                            {student.name} {student.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label>Clase</Label>
                                <select
                                    name="classSchedule_id"
                                    value={form.classSchedule_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-300 bg-white dark:bg-[#393d40] text-black dark:text-white">
                                    <option value="">Seleccionar clase</option>

                                    {/* Si aún no se ha cargado el schedule completo, mostrar esta opción temporal */}
                                    {selectedClass && (
                                        <option value={selectedClass.id}>
                                            Clase ID {selectedClass.id} - Hora:{' '}
                                            {selectedClass.scheduleTimeslot
                                                ?.hour ?? '---'}
                                        </option>
                                    )}

                                    {classSchedule.map(
                                        (schedule: {
                                            id: string
                                            scheduleTimeslot?: { hour: string }
                                        }) => (
                                            <option
                                                key={schedule.id}
                                                value={schedule.id}>
                                                Clase ID {schedule.id} - Hora:{' '}
                                                {schedule.scheduleTimeslot
                                                    ?.hour ?? '---'}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                            <div>
                                <Label>Monto</Label>
                                <Input
                                    className="dark:text-white cursor-pointer border-gray-300 dark:border-gray-300 dark:bg-[#393d40]"
                                    name="amount"
                                    type="number"
                                    value={form.amount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label className="dark:text-white">
                                    Estado
                                </Label>
                                <select
                                    id="status"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-md cursor-pointer border border-gray-300 dark:border-gray-300 bg-white dark:bg-[#393d40] text-black dark:text-white">
                                    <option value="pendiente">Pendiente</option>
                                    <option value="pagado">Pagado</option>
                                    <option value="rechazado">Rechezado</option>
                                </select>
                            </div>
                            <div>
                                <Label>Fecha de inicio</Label>
                                <Input
                                    className="dark:text-white cursor-pointer border-gray-300 dark:border-gray-300 dark:bg-[#393d40]"
                                    name="date_start"
                                    type="date"
                                    value={form.date_start}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Fecha de pago</Label>
                                <Input
                                    className="dark:text-white cursor-pointer border-gray-300 dark:border-gray-300 dark:bg-[#393d40]"
                                    name="payment_date"
                                    type="date"
                                    value={form.payment_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Fecha de expiración</Label>
                                <Input
                                    className="dark:text-white cursor-pointer border-gray-300 dark:border-gray-300 dark:bg-[#393d40]"
                                    name="expiration_date"
                                    type="date"
                                    value={form.expiration_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Guardando...' : 'Actualizar Pago'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
