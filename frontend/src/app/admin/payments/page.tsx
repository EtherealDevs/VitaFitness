'use client'
import { type Payment, usePayments } from '@/hooks/payments'
import { useState, useEffect } from 'react'
import {
    Plus,
    Edit2,
    Trash2,
    Eye,
} from 'lucide-react'
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
import { Label } from '../components/ui/label'

export default function PaymentsPage() {
    const { getPayments, deletePayment } = usePayments()
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [filterStartDate, setFilterStartDate] = useState('')
    const [filterPaymentDate, setFilterPaymentDate] = useState('')
    const [filterExpirationDate, setFilterExpirationDate] = useState('')

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
    }, [getPayments]) // Se agrega `getPayments` como dependencia

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm(
            '¿Estás seguro de que deseas eliminar este pago?',
        )
        if (!confirmDelete) return

        try {
            await deletePayment(id)
            setPayments(payments.filter(payment => payment.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    // Filtrar pagos según la búsqueda
    const filteredPayments = payments?.filter((payment: Payment) => {
        const matchesSearch =
            payment.status?.toLowerCase().includes(search.toLowerCase()) ||
            payment.expiration_date
                ?.toLowerCase()
                .includes(search.toLowerCase())

        const matchesStartDate = filterStartDate
            ? payment.date_start?.startsWith(filterStartDate)
            : true

        const matchesPaymentDate = filterPaymentDate
            ? payment.payment_date?.startsWith(filterPaymentDate)
            : true

        const matchesExpirationDate = filterExpirationDate
            ? payment.expiration_date?.startsWith(filterExpirationDate)
            : true

        return (
            matchesSearch &&
            matchesStartDate &&
            matchesPaymentDate &&
            matchesExpirationDate
        )
    })
    const [currentPage, setCurrentPage] = useState(1)
    const paymentsPerPage = 20

    const indexOfLastPayment = currentPage * paymentsPerPage
    const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage
    const currentPayments = filteredPayments.slice(
        indexOfFirstPayment,
        indexOfLastPayment,
    )

    const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage)

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                    <Label>Fecha de inicio</Label>
                    <Input
                        type="date"
                        value={filterStartDate}
                        onChange={e => setFilterStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <Label>Fecha de pago</Label>
                    <Input
                        type="date"
                        value={filterPaymentDate}
                        onChange={e => setFilterPaymentDate(e.target.value)}
                    />
                </div>
                <div>
                    <Label>Fecha de expiración</Label>
                    <Input
                        type="date"
                        value={filterExpirationDate}
                        onChange={e => setFilterExpirationDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabla de Pagos */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Lista de Pagos</CardTitle>
                    <Link href="/admin/payments/create/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Cargar un Pago
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Clase</TableHead>
                                    <TableHead>Fecha de inicio</TableHead>
                                    <TableHead>Fecha de pago</TableHead>
                                    <TableHead>Fecha de expiración</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentPayments?.map((payment: Payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <Link
                                                href={`/admin/payments/edit/${payment.id}`}
                                                className="font-medium hover:underline">
                                                {payment.student_id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {payment.student.name}{' '}
                                            {payment.student.last_name}
                                        </TableCell>
                                        <TableCell>${payment.amount}</TableCell>
                                        <TableCell>
                                            {payment.classSchedule_id}
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
                                                    href={`/admin/payments/show/${payment.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
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
                    <div className="flex justify-between items-center mt-4">
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}>
                            ← Anterior
                        </Button>

                        <span className="text-sm">
                            Página {currentPage} de {totalPages}
                        </span>

                        <Button
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}>
                            Siguiente →
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
