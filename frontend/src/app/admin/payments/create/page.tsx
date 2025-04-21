'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePayments } from '@/hooks/payments'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/app/admin/components/ui/input'
import { Label } from '@/app/admin/components/ui/label'
import { Button } from '@/app/admin/components/ui/button'
import { AxiosError } from 'axios'
import { Student } from '../../students/columns'
import { useStudents } from '@/hooks/students'
import axios from '@/lib/axios'

export default function CreatePayment() {
    const router = useRouter()
    const { createPayment } = usePayments()
    const [students, setStudents] = useState<Student[]>([])
    const [classSchedule, setClassSchedule] = useState([])
    const { getStudents } = useStudents()
    const [form, setForm] = useState({
        student_id: '',
        classSchedule_id: '',
        amount: '',
        status: 'pendiente',
        date_start: '',
        payment_date: '',
        expiration_date: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
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
        fetchStudents()
    }, [fetchStudents])

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData()
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value)
        })

        try {
            await createPayment(formData)
            router.push('/admin/payments')
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                setError(
                    err.response?.data?.message ||
                        'Hubo un error al cargar el pago.',
                )
            } else {
                setError('Hubo un error inesperado.')
            }
        }
    }
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Cargar un nuevo pago</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Nuevo Pago</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="dark:text-white">
                                    Alumno
                                </Label>
                                <select
                                    name="student_id"
                                    value={form.student_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 cursor-pointer rounded-md border border-gray-300 dark:border-gray-300 bg-white dark:bg-zinc-950 text-black dark:text-white">
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
                                <Label className="dark:text-white">Clase</Label>
                                <select
                                    name="classSchedule_id"
                                    value={form.classSchedule_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 cursor-pointer rounded-md border border-gray-300 dark:border-gray-300 bg-white dark:bg-zinc-950 text-black dark:text-white">
                                    <option value="">Seleccionar clase</option>
                                    {classSchedule.map(
                                        (schedule: {
                                            id: string
                                            scheduleTimeslot?: { hour: string }
                                        }) => (
                                            <option
                                                key={schedule.id}
                                                value={schedule.id}>
                                                Clase ID {schedule.id} - Hora:{' '}
                                                {
                                                    schedule.scheduleTimeslot
                                                        ?.hour
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                            <div>
                                <Label className="dark:text-white">Monto</Label>
                                <Input
                                    className="dark:text-white border-gray-300 dark:border-gray-300 dark:bg-transparent"
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
                                    className="w-full p-2 rounded-md cursor-pointer border border-gray-300 dark:border-gray-300 bg-white dark:bg-zinc-950 text-black dark:text-white">
                                    <option value="pendiente">Pendiente</option>
                                    <option value="pagado">Activo</option>
                                    <option value="rechazado">Inactivo</option>
                                </select>
                            </div>
                            <div>
                                <Label className="dark:text-white">
                                    Fecha de inicio
                                </Label>
                                <Input
                                    className="dark:text-white cursor-pointer border-gray-300 dark:border-gray-300 dark:bg-transparent"
                                    name="date_start"
                                    type="date"
                                    value={form.date_start}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label className="dark:text-white">
                                    Fecha de pago
                                </Label>
                                <Input
                                    className="dark:text-white cursor-pointer border-gray-300 dark:border-gray-300 dark:bg-transparent"
                                    name="payment_date"
                                    type="date"
                                    value={form.payment_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label className="dark:text-white">
                                    Fecha de expiración
                                </Label>
                                <Input
                                    className="dark:text-white cursor-pointer border-gray-300 dark:border-gray-300 dark:bg-transparent"
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
                                {loading ? 'Cargando...' : 'Guardar Pago'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
