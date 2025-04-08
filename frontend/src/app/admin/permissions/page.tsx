'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable } from '../components/ui/data-table'
import { Button } from '../components/ui/button'
import { Checkbox } from '@/app/admin/components/ui/checkbox'
import type { ColumnDef } from '@tanstack/react-table'
import { Roles, Users, useUser } from '@/hooks/users'
import { toast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'

export default function PermissionsPage() {
    const [users, setUsers] = useState<Users[]>([])
    const [roles, setRoles] = useState<Roles[]>([])
    const { getUsers, getRoles, update } = useUser()

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

    useEffect(() => {
        fetchData()
    }, [])

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
                            const hasRole = user.roles.some(
                                r => r.id === role.id,
                            )
                            return (
                                <label
                                    key={role.id}
                                    className="flex items-center gap-2">
                                    <Checkbox
                                        checked={hasRole}
                                        onCheckedChange={async checked => {
                                            const newRoles = checked
                                                ? [...user.roles, role]
                                                : user.roles.filter(
                                                      r => r.id !== role.id,
                                                  )

                                            const formdata = new FormData()
                                            newRoles.forEach(r => {
                                                formdata.append(
                                                    'roles[]',
                                                    String(r.id),
                                                )
                                            })

                                            await update(user.id, formdata)

                                            setUsers(prev =>
                                                prev.map(u =>
                                                    u.id === user.id
                                                        ? {
                                                              ...u,
                                                              roles: newRoles,
                                                          }
                                                        : u,
                                                ),
                                            )

                                            toast({
                                                title: 'Roles actualizados',
                                                description: `Se actualizaron los roles de ${user.name}.`,
                                                action: (
                                                    <ToastAction altText="Cerrar">
                                                        Cerrar
                                                    </ToastAction>
                                                ),
                                            })
                                        }}
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

    if (!roles.length) return null // Opcional: esperar a que carguen los roles

    return (
        <div className="py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Permisos</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Permiso
                </Button>
            </div>
            <div className="mt-6">
                <DataTable
                    columns={columns}
                    data={users}
                    filterColumn="name"
                    filterPlaceholder="Filtrar permisos..."
                />
            </div>
        </div>
    )
}
