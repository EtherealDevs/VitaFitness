'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePayments } from '@/hooks/payments'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/app/admin/components/ui/input'
import { Label } from '@/app/admin/components/ui/label'
import { Button } from '@/app/admin/components/ui/button'

interface EditPaymentProps {
    params: {
        id?: string
    }
}

export default function EditPayment({ params }: EditPaymentProps) {
    const router = useRouter()
    const { getPayment, updatePayment } = usePayments()

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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    useEffect(() => {
        if (id) {
            getPayment(id)
                .then(data => {
                    setForm({
                        student_id: data.student_id,
                        classSchedule_id: data.classSchedule_id,
                        amount: data.amount,
                        status: data.status,
                        date_start: data.date_start,
                        payment_date: data.payment_date,
                        expiration_date: data.expiration_date,
                    })
                })
                .catch(console.error)
        }
    }, [id, getPayment])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append('student_id', form.student_id)
        formData.append('classSchedule_id', form.classSchedule_id)
        formData.append('amount', form.amount)
        formData.append('status', form.status)
        formData.append('date_start', form.date_start)
        formData.append('payment_date', form.payment_date)
        formData.append('expiration_date', form.expiration_date)

        try {
            if (!params.id) throw new Error('ID inválido')
            await updatePayment(params.id, formData)
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
                                <Input
                                    name="student_id"
                                    value={form.student_id}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Clase</Label>
                                <Input
                                    name="classSchedule_id"
                                    value={form.classSchedule_id}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Monto</Label>
                                <Input
                                    name="amount"
                                    type="number"
                                    value={form.amount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Estado</Label>
                                <Input
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Fecha de inicio</Label>
                                <Input
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
