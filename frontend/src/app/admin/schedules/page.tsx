'use client'
import { Schedule, useSchedules } from '@/hooks/schedules'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/app/admin/components/ui/card'
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

export default function Schedules() {
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [loading, setLoading] = useState(false)
    const { getSchedules, deleteSchedule } = useSchedules()

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getSchedules()
            setSchedules(response.schedules)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [getSchedules])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm('¿Estás seguro de eliminar este horario?')
        if (!confirmDelete) return

        try {
            await deleteSchedule(id)
            fetchData()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="space-y-6 p-6 max-w-full">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-2xl md:text-3xl font-bold">Horarios</h1>
                <Link href="/admin/schedules/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Horario
                    </Button>
                </Link>
            </div>

            <Card className="w-full">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Lista de Horarios</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-10">Cargando...</div>
                    ) : (
                        <div className="rounded-md border overflow-scroll max-w-full">
                            <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Día</TableHead>
                                        <TableHead>Hora de Inicio</TableHead>
                                        <TableHead>Hora de Fin</TableHead>
                                        <TableHead className="text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {schedules.map(schedule => (
                                        <TableRow key={schedule.id}>
                                            <TableCell>{schedule.id}</TableCell>
                                            <TableCell>
                                                {schedule.days}
                                            </TableCell>
                                            <TableCell>
                                                {schedule.time_start}
                                            </TableCell>
                                            <TableCell>
                                                {schedule.time_end}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/schedules/edit/${schedule.id}`}>
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
                                                            handleDelete(
                                                                schedule.id,
                                                            )
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
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
