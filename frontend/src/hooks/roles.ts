import axios from '@/lib/axios'


export const useRoles = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getRoles = async () => {
        await csrf()
        try {
            const response = await axios.get('/api/roles')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const createRoles = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/roles', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const syncRoles = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/roles/sync', formData)
            return response.data
            } catch (error) {
            console.error(error)
            throw error
        }
    }
    const updateRoles = async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/roles/${id}?_method=PUT`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const deleteRoles = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/roles/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return {
        getRoles,
        createRoles,
        updateRoles,
        deleteRoles,
        syncRoles,
    }
}