'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Roles, useUser } from '@/hooks/users'
import { useRoles } from '@/hooks/roles'

interface Users {
    id: string
    name: string
    email: string
    email_verified_at: string
    created_at: string
    updated_at: string
}

export default function CreatePermissionPage() {
    const router = useRouter()
    const { getRoles, syncRoles } = useRoles();
    const { getUsers } = useUser();
    const [roles, setRoles] = useState<Roles[]>([])
    const [users, setUsers] = useState<Users[]>([])

    const [selectedUser, setSelectedUser] = useState<Users | null>(null)
    const [selectedRole, setSelectedRole] = useState<Roles | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getRoles()
                const users = await getUsers()

                setRoles(response.roles)
                setUsers(users.users)
            } catch (error) {
                console.error('Error al crear el permiso:', error)
            }
        }

        fetchData()
    }, [getRoles, getUsers])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const user_id = selectedUser?.id
        const role_name = selectedRole?.name

        if (!user_id || !role_name) {
            return
        }

        const formData = new FormData()
        formData.append('user_id', user_id)
        formData.append('role_name', String(role_name))

        await syncRoles(formData)

        router.push('/admin/permissions')
    }
    const handleUserChange = (userId: string) => {
        const user = users.find(u => u.id == userId)
        setSelectedUser(user || null)
    }

    const handleRoleChange = (roleId: string) => {
        const role = roles.find(r => String(r.name) == roleId)
        setSelectedRole(role || null)
    }
    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold">Crear nuevo permiso</h1>
            <form
                className="space-y-4"
                onSubmit={handleSubmit}
                method="post"
                encType="multipart/form-data">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="user_id" className="block text-sm font-medium">
                            Usuario
                        </label>
                        <select
                            name="user_id"
                            id="user_id"
                            onChange={e => handleUserChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="">Seleccionar...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="role_name" className="block text-sm font-medium">
                            Roles
                        </label>
                        <select
                            name="role_name"
                            id="role_name"
                            onChange={e => handleRoleChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="">Seleccionar...</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <button
                        type="submit"
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        Crear
                    </button>
                </div>
            </form>
        </div>
    )
}