'use client'

import { useEffect, useState } from 'react'
import { Plus, Users, Shield, Search } from 'lucide-react'
import Link from 'next/link'
import { type Roles, type Users as UsersType, useUser } from '@/hooks/users'
import { Button } from '../components/ui/button'
import { Checkbox } from '@/app/admin/components/ui/checkbox'

export default function PermissionsPage() {
    const [users, setUsers] = useState<UsersType[]>([])
    const [roles, setRoles] = useState<Roles[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')

    const { getUsers, getRoles } = useUser()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                const [usersResponse, rolesResponse] = await Promise.all([
                    getUsers(),
                    getRoles(),
                ])

                const usersData =
                    usersResponse?.users || usersResponse?.data?.users || []
                const rolesData =
                    rolesResponse?.roles || rolesResponse?.data?.roles || []

                setUsers(usersData)
                setRoles(rolesData)
            } catch (err) {
                console.error('Error completo:', err)
                setError(
                    'Error al cargar los datos: ' +
                        (err instanceof Error
                            ? err.message
                            : 'Error desconocido'),
                )
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [getRoles, getUsers])

    // Filtrar usuarios
    const filteredUsers = users.filter(
        user =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Filtrar roles - removemos el filtro de guard_name para mostrar todos los roles
    const availableRoles = roles.filter(
        role => role.name && role.name.trim() !== '',
    )

    if (loading) {
        return (
            <div className="min-h-screen w-full p-4 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Cargando permisos...
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen w-full p-4 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                            Error al cargar datos
                        </h3>
                        <p className="text-red-600 dark:text-red-300 mb-4 text-sm">
                            {error}
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full">
                            Reintentar
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full p-4">
            <div className="w-full max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        Permisos
                    </h1>
                    <Link href="/admin/permissions/create">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Permiso
                        </Button>
                    </Link>
                </div>

                <div className="bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                    {/* Search */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Buscar usuarios..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                <Users className="mx-auto mb-4 w-10 h-10" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No se encontraron usuarios
                                </h3>
                                <p className="mb-4 text-sm">
                                    {searchTerm
                                        ? 'No hay resultados que coincidan con tu búsqueda.'
                                        : 'Aún no hay usuarios registrados.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50/50 dark:hover:bg-slate-800/70">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {user.name}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Roles section */}
                                            {availableRoles.length > 0 && (
                                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                        Roles asignados:
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {availableRoles.map(
                                                            role => {
                                                                const hasRole =
                                                                    user.roles?.some(
                                                                        r =>
                                                                            r.id ===
                                                                            role.id,
                                                                    ) || false
                                                                return (
                                                                    <div
                                                                        key={
                                                                            role.id
                                                                        }
                                                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${
                                                                            hasRole
                                                                                ? 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300'
                                                                                : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                                                                        }`}>
                                                                        <Checkbox
                                                                            checked={
                                                                                hasRole
                                                                            }
                                                                            disabled={
                                                                                true
                                                                            }
                                                                            className="h-4 w-4"
                                                                        />
                                                                        <span className="font-medium">
                                                                            {
                                                                                role.name
                                                                            }
                                                                        </span>
                                                                        {role.guard_name && (
                                                                            <span className="text-xs opacity-75">
                                                                                (
                                                                                {
                                                                                    role.guard_name
                                                                                }
                                                                                )
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
