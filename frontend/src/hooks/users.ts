import axios from '@/lib/axios'
import { useCallback } from 'react'

export interface Roles {
    id: number
    name: string
    guard_name: string
}

export interface Users {
    id: string
    name: string
    email: string
    email_verified_at: string
    roles: Roles[]
    created_at: string
    updated_at: string
}

export const useUser = () => {
    const csrf = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie')
        } catch (error) {
            console.error('Error al obtener el token CSRF:', error)
            throw error
        }
    }
    const getUsers = useCallback(async () => {
        const response = await axios.get('/api/users')
        return response.data
    }, [])

    const getRoles = useCallback(async () => {
        const response = await axios.get('/api/roles')
        return response.data
    }, [])

    const update = async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/users/${id}?_method=PATCH`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error('Error al actualizar el usuario:', error)
            throw error
        }
    }
    return {
        getUsers,
        update,
        getRoles,
    }
}
