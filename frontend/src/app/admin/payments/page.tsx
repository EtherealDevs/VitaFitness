'use client'
import { type Payment, usePayments } from '@/hooks/payments'
import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import Link from 'next/link'

export default function PaymentsPage() {
    const { getPayments, deletePayment } = usePayments()
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchPayments() {
            setLoading(true)
            try {
                const response = await getPayments()
                setPayments(response.payments)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchPayments()
    }, [])

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm(
            '¿Estás seguro de que deseas eliminar este producto?',
        )
        if (!confirmDelete) return

        try {
            await deletePayment(id)
            setPayments(payments.filter(payment => payment.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    // Filtrar productos según la búsqueda
    const filteredPayments = payments?.filter(
        (payment: Payment) =>
            payment.status?.toLowerCase().includes(search.toLowerCase()) ||
            payment.expiration_date
                ?.toLowerCase()
                .includes(search.toLowerCase()),
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4">Cargando pagos...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Pagos</h1>
            </div>

            <div className="flex items-center gap-4">
                <Input
                    placeholder="Buscar pago..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {/* Tabla de Productos */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Lista de Pagos</CardTitle>
                    <Link href="/admin/products/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Pago
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Fecha de inicio</TableHead>
                                    <TableHead>Fecha de pago</TableHead>
                                    <TableHead>Fecha de expiracion</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayments?.map((payment: Payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <Link
                                                href={`/admin/payments/edit/${payment.id}`}
                                                className="font-medium hover:underline">
                                                {payment.student_id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{payment.amount}</TableCell>
                                        <TableCell>
                                            ${payment.plan_id}
                                        </TableCell>
                                        <TableCell>
                                            {payment.date_start}
                                        </TableCell>
                                        <TableCell>
                                            {payment.payment_date}
                                        </TableCell>
                                        <TableCell>
                                            {payment.expiration_date}
                                        </TableCell>
                                        <TableCell>{payment.status}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/payments/edit/${payment.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(payment.id)
                                                    }>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
