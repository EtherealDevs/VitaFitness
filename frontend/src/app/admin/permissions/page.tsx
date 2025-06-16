'use client'

import { useEffect, useState } from 'react'
import {
    Plus,
    Users,
    Shield,
    Search,
    Trash2,
    Save,
    AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '../components/ui/button'
import { Checkbox } from '@/app/admin/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { useRoles } from '@/hooks/roles'
import { useUser } from '@/hooks/users'

interface Role {
    id: string
    name: string
    guard_name?: string
    created_at: string
    updated_at: string
}

interface User {
    id: string
    name: string
    email: string
    roles?: Role[]
}

interface AxiosError {
    response?: {
        data?: {
            message?: string
            errors?: Record<string, string[]>
        }
        status?: number
    }
    message?: string
}

export default function PermissionsPage() {
    const [users, setUsers] = useState<User[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [saving, setSaving] = useState<{ [key: string]: boolean }>({})
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [changedRoles, setChangedRoles] = useState<{
        [key: string]: { [key: string]: boolean }
    }>({})

    const userHook = useUser()
    const rolesHook = useRoles()

    // Función para cargar datos - definida dentro del useEffect para evitar dependencias
    useEffect(() => {
        let isMounted = true

        const loadData = async () => {
            try {
                setLoading(true)
                setError(null)

                const [usersResponse, rolesResponse] = await Promise.all([
                    userHook.getUsers(),
                    userHook.getRoles(),
                ])

                if (!isMounted) return

                const usersData =
                    usersResponse?.users || usersResponse?.data?.users || []
                const rolesData =
                    rolesResponse?.roles || rolesResponse?.data?.roles || []

                setUsers(usersData)
                setRoles(rolesData)
            } catch (err) {
                if (!isMounted) return
                console.error('Error completo:', err)
                setError(
                    'Error al cargar los datos: ' +
                        (err instanceof Error
                            ? err.message
                            : 'Error desconocido'),
                )
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadData()

        // Cleanup function para evitar actualizaciones de estado si el componente se desmonta
        return () => {
            isMounted = false
        }
    }, []) // Array vacío - solo ejecutar una vez al montar

    // Función separada para refresh manual
    const refreshData = async () => {
        try {
            setLoading(true)
            setError(null)

            const [usersResponse, rolesResponse] = await Promise.all([
                userHook.getUsers(),
                userHook.getRoles(),
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
                    (err instanceof Error ? err.message : 'Error desconocido'),
            )
        } finally {
            setLoading(false)
        }
    }

    // Manejar cambios en los checkboxes de roles
    const handleRoleChange = (
        userId: string,
        roleId: string,
        checked: boolean,
    ) => {
        setChangedRoles(prev => ({
            ...prev,
            [userId]: {
                ...(prev[userId] || {}),
                [roleId]: checked,
            },
        }))
    }

    // Obtener los IDs de roles que un usuario debería tener después de aplicar cambios
    const getFinalRoleIds = (user: User): string[] => {
        const currentRoleIds = new Set(user.roles?.map(r => r.id) || [])
        const changes = changedRoles[user.id] || {}

        // Aplicar los cambios pendientes
        Object.entries(changes).forEach(([roleId, shouldHave]) => {
            if (shouldHave) {
                currentRoleIds.add(roleId)
            } else {
                currentRoleIds.delete(roleId)
            }
        })

        return Array.from(currentRoleIds)
    }

    // Guardar los cambios de roles para un usuario específico
    const saveRoleChanges = async (userId: string) => {
        if (!changedRoles[userId]) return

        try {
            setSaving(prev => ({ ...prev, [userId]: true }))

            const user = users.find(u => u.id === userId)
            if (!user) return

            // Obtener los IDs de roles finales
            const finalRoleIds = getFinalRoleIds(user)

            // Preparar FormData - probamos el formato más común primero
            const formData = new FormData()
            formData.append('user_id', userId)

            // Formato Laravel estándar para arrays
            finalRoleIds.forEach(roleId => {
                formData.append('roles[]', roleId)
            })

            console.log('Enviando datos:', {
                user_id: userId,
                roles: finalRoleIds,
            })

            // Llamar al endpoint de sync
            const response = await rolesHook.syncRoles(formData)
            console.log('Respuesta del servidor:', response)

            // Actualizar la UI con los nuevos roles
            setUsers(prevUsers =>
                prevUsers.map(u => {
                    if (u.id === userId) {
                        const updatedRoles = roles.filter(role =>
                            finalRoleIds.includes(role.id),
                        )
                        return { ...u, roles: updatedRoles }
                    }
                    return u
                }),
            )

            // Limpiar los cambios para este usuario
            setChangedRoles(prev => {
                const newChanges = { ...prev }
                delete newChanges[userId]
                return newChanges
            })

            toast({
                title: 'Roles actualizados',
                description: `Los roles para ${user.name} han sido actualizados correctamente.`,
            })
        } catch (error) {
            console.error('Error al actualizar roles:', error)

            // Mostrar error más específico si está disponible
            let errorMessage =
                'No se pudieron actualizar los roles. Inténtalo de nuevo.'

            const axiosError = error as AxiosError
            if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message
            } else if (axiosError.response?.data?.errors) {
                const errors = axiosError.response.data.errors
                const errorList = Object.entries(errors).map(
                    ([field, messages]) =>
                        `${field}: ${
                            Array.isArray(messages)
                                ? messages.join(', ')
                                : messages
                        }`,
                )
                errorMessage = errorList.join(' | ')
            } else if (axiosError.message) {
                errorMessage = axiosError.message
            }

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setSaving(prev => ({ ...prev, [userId]: false }))
        }
    }

    // Eliminar todos los roles de un usuario
    const removeAllRoles = async (userId: string) => {
        try {
            setSaving(prev => ({ ...prev, [userId]: true }))

            const user = users.find(u => u.id === userId)
            if (!user) return

            // Preparar FormData para quitar todos los roles
            const formData = new FormData()
            formData.append('user_id', userId)
            // No agregar roles[] para indicar array vacío

            console.log('Eliminando todos los roles para usuario:', userId)

            // Llamar al endpoint de sync
            const response = await rolesHook.syncRoles(formData)
            console.log('Respuesta del servidor:', response)

            // Actualizar la UI
            setUsers(prevUsers =>
                prevUsers.map(u => {
                    if (u.id === userId) {
                        return { ...u, roles: [] }
                    }
                    return u
                }),
            )

            // Limpiar cambios pendientes para este usuario
            setChangedRoles(prev => {
                const newChanges = { ...prev }
                delete newChanges[userId]
                return newChanges
            })

            toast({
                title: 'Roles eliminados',
                description: `Todos los roles para ${user.name} han sido eliminados.`,
            })
        } catch (error) {
            console.error('Error al eliminar roles:', error)

            let errorMessage =
                'No se pudieron eliminar los roles. Inténtalo de nuevo.'

            const axiosError = error as AxiosError
            if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message
            } else if (axiosError.response?.data?.errors) {
                const errors = axiosError.response.data.errors
                const errorList = Object.entries(errors).map(
                    ([field, messages]) =>
                        `${field}: ${
                            Array.isArray(messages)
                                ? messages.join(', ')
                                : messages
                        }`,
                )
                errorMessage = errorList.join(' | ')
            } else if (axiosError.message) {
                errorMessage = axiosError.message
            }

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setSaving(prev => ({ ...prev, [userId]: false }))
        }
    }

    // Filtrar usuarios
    const filteredUsers = users.filter(
        user =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Filtrar roles - mostramos todos los roles disponibles
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
                        <Button onClick={refreshData} className="w-full">
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
                                {filteredUsers.map(user => {
                                    const hasChanges =
                                        changedRoles[user.id] &&
                                        Object.keys(changedRoles[user.id])
                                            .length > 0
                                    const isSaving = saving[user.id]

                                    return (
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
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                            ID: {user.id}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {hasChanges && (
                                                            <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm mr-2">
                                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                                Cambios sin
                                                                guardar
                                                            </div>
                                                        )}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeAllRoles(
                                                                    user.id,
                                                                )
                                                            }
                                                            disabled={
                                                                isSaving ||
                                                                !user.roles ||
                                                                user.roles
                                                                    .length ===
                                                                    0
                                                            }
                                                            className="border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30">
                                                            <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                saveRoleChanges(
                                                                    user.id,
                                                                )
                                                            }
                                                            disabled={
                                                                isSaving ||
                                                                !hasChanges
                                                            }
                                                            className="bg-purple-600 hover:bg-purple-700 text-white">
                                                            {isSaving ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                                    <span>
                                                                        Guardando
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <Save className="h-4 w-4" />
                                                                    <span>
                                                                        Guardar
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Roles section */}
                                                {availableRoles.length > 0 && (
                                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                            Roles disponibles:
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {availableRoles.map(
                                                                role => {
                                                                    // Verificar si el usuario tiene este rol actualmente
                                                                    const hasRole =
                                                                        user.roles?.some(
                                                                            r =>
                                                                                r.id ===
                                                                                role.id,
                                                                        ) ||
                                                                        false

                                                                    // Verificar si hay cambios pendientes para este rol
                                                                    const pendingChange =
                                                                        changedRoles[
                                                                            user
                                                                                .id
                                                                        ]?.[
                                                                            role
                                                                                .id
                                                                        ]
                                                                    const isChecked =
                                                                        pendingChange !==
                                                                        undefined
                                                                            ? pendingChange
                                                                            : hasRole

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                role.id
                                                                            }
                                                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${
                                                                                isChecked
                                                                                    ? 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300'
                                                                                    : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                                                                            } ${
                                                                                pendingChange !==
                                                                                undefined
                                                                                    ? 'ring-2 ring-amber-300 dark:ring-amber-500/30'
                                                                                    : ''
                                                                            } ${
                                                                                isSaving
                                                                                    ? 'opacity-50 cursor-not-allowed'
                                                                                    : 'cursor-pointer hover:shadow-sm'
                                                                            }`}>
                                                                            <Checkbox
                                                                                checked={
                                                                                    isChecked
                                                                                }
                                                                                disabled={
                                                                                    isSaving
                                                                                }
                                                                                onCheckedChange={checked => {
                                                                                    handleRoleChange(
                                                                                        user.id,
                                                                                        role.id,
                                                                                        checked ===
                                                                                            true,
                                                                                    )
                                                                                }}
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
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
