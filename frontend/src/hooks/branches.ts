/* import useSWR from 'swr' */
import axios from '@/lib/axios'
/* import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation' */

export const useBranches = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getBranches = async () => {
        await csrf()
        try {
            const response = await axios.get('/api/branches')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const getBranch = async (id: string) => {
        try {
            const response = await axios.get(`/api/branches/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const createBranch = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/branches', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const updateBranch = async (id: string, formData: FormData) => {
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
    }

    const deleteBranch = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/branches/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return {
        getBranch,
        getBranches,
        createBranch,
        updateBranch,
        deleteBranch,
    }
}
