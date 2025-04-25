import { useCallback } from 'react'
import axios from '@/lib/axios'

export interface Branch {
    id: string
    name: string
    address: string
}

export const useBranches = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const getBranches = useCallback(async () => {
        await csrf()
        try {
            const response = await axios.get('/api/branches')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    const getBranch = useCallback(async (id: string) => {
        try {
            const response = await axios.get(`/api/branches/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    const createBranch = useCallback(async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/branches', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    const updateBranch = useCallback(async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/branches/${id}?_method=PUT`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    const deleteBranch = useCallback(async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/branches/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    return {
        getBranch,
        getBranches,
        createBranch,
        updateBranch,
        deleteBranch,
    }
}
