'use client'

import { useClasses } from '@/hooks/classes'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '../components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'
import { ToastAction } from '@radix-ui/react-toast'

interface Schedule {
    id: number
    selectedDays: string[]
    time_start: string
    time_end: string
}

interface Plan {
    id: number
    name: string
    description: string
    status: string
}

interface Branch {
    id: number
    name: string
    address: string
}

interface Class {
    id: string
    name: string
    max_students: number
    plan: Plan
    branch: Branch
    precio: number
    schedules: Schedule[]
}

export default function ClassPage() {
    const { getClasses, deleteClass } = useClasses()
    const [classes, setClasses] = useState<Class[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getClasses()
                setClasses(response.classes)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [getClasses])

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            '¿Estás seguro que querés eliminar esta clase? Esta acción no se puede deshacer.',
        )
        if (!confirmed) return
        try {
            await deleteClass(id)
            setClasses(prev => prev.filter(cls => cls.id !== id))
            toast({
                title: 'Clase eliminada',
                description: `La clase con ID ${id} fue eliminada.`,
                action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
            })
        } catch (error) {
            console.error('Error al eliminar clase:', error)
        }
    }

    const columns: ColumnDef<Class>[] = [
        {
            accessorKey: 'name',
            header: 'Clase',
            cell: ({ row }) => row.original.name,
        },
        {
            accessorKey: 'branch',
            header: 'Sucursal',
            cell: ({ row }) => {
                const branch = row.original.branch
                return (
                    <div>
                        <div className="font-semibold">{branch.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {branch.address}
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'precio',
            header: 'Precio',
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    ${row.original.precio}
                </div>
            ),
        },
        {
            accessorKey: 'plan',
            header: 'Plan',
            cell: ({ row }) => (
                <div className="font-semibold">{row.original.plan.name}</div>
            ),
        },
        {
            accessorKey: 'max_students',
            header: 'Máx. alumnos',
            cell: ({ row }) => row.original.max_students,
        },
        {
            accessorKey: 'schedules',
            header: 'Horarios',
            cell: ({ row }) => {
                const schedules = row.original.schedules
                return (
                    <ul className="text-sm leading-tight">
                        {schedules.map((s, i) => (
                            <li key={i}>
                                <span className="font-medium">
                                    {s.selectedDays.join(', ')}
                                </span>{' '}
                                — {s.time_start} a {s.time_end}
                            </li>
                        ))}
                    </ul>
                )
            },
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const cls = row.original
                return (
                    <div className="flex gap-2">
                        <Link
                        href={`/admin/classes/show/${cls.id}`}>
                        <Button variant="outline" size="sm">
                            Alumnos / Profes
                        </Button>
                        </Link>
                        <Link
                            href="/admin/classes/edit/[id]"
                            as={`/admin/classes/edit/${cls.id}`}>
                            <Button variant="outline" size="sm">
                                Editar
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(cls.id)}>
                            Eliminar
                        </Button>
                    </div>
                )
            },
        },
    ]

    return (
        <div className="py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Clases</h1>
                <Link href="/admin/classes/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Clase
                    </Button>
                </Link>
            </div>
            <div className="mt-6">
                <DataTable
                    columns={columns}
                    data={classes}
                    filterColumn="name"
                    filterPlaceholder="Filtrar clases..."
                />
            </div>
        </div>
    )
}
