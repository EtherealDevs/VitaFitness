'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'

import { Roles, Users, useUser } from '@/hooks/users'
import { toast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'

import { Button } from '../components/ui/button'
import { Checkbox } from '@/app/admin/components/ui/checkbox'
import { DataTable } from '../components/ui/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table } from '../components/ui/table'

import type { ColumnDef } from '@tanstack/react-table'

export default function PermissionsPage() {
    const [users, setUsers] = useState<Users[]>([])
    const [roles, setRoles] = useState<Roles[]>([])
    const { getUsers, getRoles, update } = useUser()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUsers()
                const roles = await getRoles()
                setRoles(roles.roles)
                setUsers(response.users)
            } catch (error) {
                console.error('Error al obtener los usuarios:', error)
            }
        }

        fetchData()
    }, [getUsers, getRoles])

    const columns: ColumnDef<Users>[] = [
        {
            accessorKey: 'name',
            header: 'Nombre',
            cell: ({ row }) => row.original.name,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => row.original.email,
        },
        {
            accessorKey: 'roles',
            header: 'Roles',
            cell: ({ row }) => {
                const user = row.original

                return (
                    <div className="flex flex-col gap-1">
                        {roles.map(role => {
                            if (role.guard_name !== 'api') {
                                return null
                            }
                            const hasRole = user.roles.some(
                                r => r.id === role.id,
                            )
                            return (
                                <label
                                    key={role.id}
                                    className="flex items-center gap-2">
                                    <Checkbox
                                        checked={hasRole}
                                        disabled={true}
                                        // onCheckedChange={async checked => {
                                        //     const newRoles = checked
                                        //         ? [...user.roles, role]
                                        //         : user.roles.filter(
                                        //               r => r.id !== role.id,
                                        //           )

                                        //     const formdata = new FormData()
                                        //     newRoles.forEach(r => {
                                        //         formdata.append(
                                        //             'roles[]',
                                        //             String(r.id),
                                        //         )
                                        //     })

                                        //     // await update(user.id, formdata)

                                        //     setUsers(prev =>
                                        //         prev.map(u =>
                                        //             u.id === user.id
                                        //                 ? {
                                        //                       ...u,
                                        //                       roles: newRoles,
                                        //                   }
                                        //                 : u,
                                        //         ),
                                        //     )

                                        //     toast({
                                        //         title: 'Roles actualizados',
                                        //         description: `Se actualizaron los roles de ${user.name}.`,
                                        //         action: (
                                        //             <ToastAction altText="Cerrar">
                                        //                 Cerrar
                                        //             </ToastAction>
                                        //         ),
                                        //     })
                                        // }}
                                    />
                                    <span>{role.name}</span>
                                </label>
                            )
                        })}
                    </div>
                )
            },
        },
    ]

    if (!roles.length) return null

    return (
        <div className="space-y-6 p-6 max-w-full">
            <div className="flex flex-wrap items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold">Permisos</h1>
                <Link href="/admin/permissions/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Permiso
                    </Button>
                </Link>
            </div>

            <Card className="w-full">
                <CardHeader className="flex flex-wrap flex-row items-center justify-between gap-2">
                    <CardTitle>Gestión de Permisos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable
                        columns={columns}
                        data={users}
                        filterColumn="name"
                        filterPlaceholder="Filtrar permisos..."
                    />
                </CardContent>
            </Card>
        </div>
    )
}
