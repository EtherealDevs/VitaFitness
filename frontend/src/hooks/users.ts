import axios from '@/lib/axios'

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
    const getUsers = async () => {
        try {
            const response = await axios.get('/api/users')
            return response.data
        } catch (error) {
            console.error('Error al obtener los usuarios:', error)
            throw error
        }
    }

    const getRoles = async () => {
        try {
            const response = await axios.get(`/api/users/roles`)
            return response.data
        } catch (error) {
            console.error('Error al obtener los roles del usuario:', error)
            throw error
        }
    }
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
