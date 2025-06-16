'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Shield, User, UserCheck, Save, X } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/app/admin/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/app/admin/components/ui/card'
import { Label } from '@/app/admin/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { useRoles } from '@/hooks/roles'
import { useUser } from '@/hooks/users'

interface Users {
    id: string
    name: string
    email: string
    email_verified_at: string
    created_at: string
    updated_at: string
}

interface Roles {
    id: string
    name: string
    guard_name: string
    created_at: string
    updated_at: string
}

export default function CreatePermissionPage() {
    const router = useRouter()
    const { getRoles, syncRoles } = useRoles()
    const { getUsers } = useUser()
    const [isLoading, setIsLoading] = useState(false)
    const [roles, setRoles] = useState<Roles[]>([])
    const [users, setUsers] = useState<Users[]>([])
    const [selectedUser, setSelectedUser] = useState<Users | null>(null)
    const [selectedRole, setSelectedRole] = useState<Roles | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rolesResponse, usersResponse] = await Promise.all([
                    getRoles(),
                    getUsers(),
                ])
                setRoles(rolesResponse.roles || [])
                setUsers(usersResponse.users || [])
            } catch (error) {
                console.error('Error al cargar datos:', error)
                toast({
                    title: 'Error',
                    description: 'Error al cargar los datos necesarios',
                    variant: 'destructive',
                })
            }
        }

        fetchData()
    }, [getRoles, getUsers])

    const handleUserChange = (userId: string) => {
        const user = users.find(u => u.id === userId)
        setSelectedUser(user || null)
    }

    const handleRoleChange = (roleId: string) => {
        const role = roles.find(r => String(r.name) === roleId)
        setSelectedRole(role || null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const user_id = selectedUser?.id
            const role_name = selectedRole?.name

            if (!user_id || !role_name) {
                toast({
                    title: 'Error',
                    description: 'Debe seleccionar un usuario y un rol',
                    variant: 'destructive',
                })
                return
            }

            const formData = new FormData()
            formData.append('user_id', user_id)
            formData.append('role_name', String(role_name))

            await syncRoles(formData)

            toast({
                title: 'Permiso creado',
                description: 'El permiso ha sido asignado exitosamente',
                variant: 'default',
            })

            router.push('/admin/permissions')
        } catch (error) {
            console.error('Error al crear el permiso:', error)
            toast({
                title: 'Error',
                description: 'Hubo un error al crear el permiso',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full p-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="w-full max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                Nuevo Permiso
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Asigne un rol a un usuario del sistema
                            </p>
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <nav className="text-sm text-slate-500 dark:text-slate-400">
                        <Link
                            href="/admin"
                            className="hover:text-purple-600 dark:hover:text-purple-400">
                            Admin
                        </Link>
                        {' > '}
                        <Link
                            href="/admin/permissions"
                            className="hover:text-purple-600 dark:hover:text-purple-400">
                            Permisos
                        </Link>
                        {' > '}
                        <span className="text-slate-900 dark:text-white">
                            Nuevo Permiso
                        </span>
                    </nav>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                        <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Asignación de Permisos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* User Selection */}
                                <div>
                                    <Label
                                        htmlFor="user_id"
                                        className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                        <User className="h-4 w-4" />
                                        Usuario
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <select
                                        id="user_id"
                                        onChange={e =>
                                            handleUserChange(e.target.value)
                                        }
                                        className="mt-2 w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                        required
                                        disabled={isLoading}>
                                        <option value="">
                                            Seleccionar usuario...
                                        </option>
                                        {users.map(user => (
                                            <option
                                                key={user.id}
                                                value={user.id}>
                                                {user.name} - {user.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Role Selection */}
                                <div>
                                    <Label
                                        htmlFor="role_name"
                                        className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                        <UserCheck className="h-4 w-4" />
                                        Rol
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <select
                                        id="role_name"
                                        onChange={e =>
                                            handleRoleChange(e.target.value)
                                        }
                                        className="mt-2 w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                        required
                                        disabled={isLoading}>
                                        <option value="">
                                            Seleccionar rol...
                                        </option>
                                        {roles.map(role => (
                                            <option
                                                key={role.id}
                                                value={role.name}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Preview Selection */}
                            {(selectedUser || selectedRole) && (
                                <Card className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
                                    <CardContent className="pt-4">
                                        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">
                                            Vista Previa
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            {selectedUser && (
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-slate-500" />
                                                    <span className="text-slate-600 dark:text-slate-400">
                                                        Usuario:
                                                    </span>
                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                        {selectedUser.name} (
                                                        {selectedUser.email})
                                                    </span>
                                                </div>
                                            )}
                                            {selectedRole && (
                                                <div className="flex items-center gap-2">
                                                    <UserCheck className="h-4 w-4 text-slate-500" />
                                                    <span className="text-slate-600 dark:text-slate-400">
                                                        Rol:
                                                    </span>
                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                        {selectedRole.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isLoading}
                                    className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <X className="mr-2 h-4 w-4" />
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg min-w-[140px]">
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Asignando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Save className="h-4 w-4" />
                                            Crear Permiso
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    )
}
