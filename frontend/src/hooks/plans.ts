import axios from '@/lib/axios'
import { useCallback } from 'react'

export interface Plan {
    id: string
    name: string
    description: string
    price: number
    status: string
    createdAt: string
    updatedAt: string
}
export const usePlans = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getPlans = useCallback(async () => {
        try {
            const response = await axios.get('/api/plans')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])
    const getPlan = async (id: string) => {
        try {
            const response = await axios.get(`/api/plans/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const createPlan = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/plans', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const updatePlan = async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/plans/${id}?_method=PUT`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const deletePlan = async (id: string) => {
        try {
            const response = await axios.delete(`/api/plans/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return {
        getPlans,
        getPlan,
        createPlan,
        updatePlan,
        deletePlan,
    }
}
