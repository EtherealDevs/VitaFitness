'use client'

import { Plan, usePlans } from '@/hooks/plans'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/admin/components/ui/table'
import { Button } from '@/app/admin/components/ui/button'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function PlansPage() {
    const { getPlans, deletePlan } = usePlans()
    const [plans, setPlans] = useState<Plan[]>([])

    const fetchPlans = useCallback(async () => {
        try {
            const response = await getPlans()
            setPlans(response.plans)
        } catch (error) {
            console.error(error)
        }
    }, [getPlans])
    useEffect(() => {
        fetchPlans()
    }, [fetchPlans])

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm('¿Estás seguro de eliminar este plan?')
        if (!confirmDelete) return

        try {
            await deletePlan(id)
            setPlans(plans.filter(plan => plan.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="space-y-6 p-6 max-w-full">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-2xl md:text-3xl font-bold">Planes</h1>
                <Link href="/admin/plans/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Plan
                    </Button>
                </Link>
            </div>

            <Card className="w-full">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Lista de Planes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-scroll max-w-full">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.map(plan => (
                                    <TableRow key={plan.id}>
                                        <TableCell>{plan.name}</TableCell>
                                        <TableCell>
                                            {plan.description}
                                        </TableCell>
                                        <TableCell>{plan.status}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/plans/edit/${plan.id}`}>
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
                                                        handleDelete(plan.id)
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
