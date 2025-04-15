import { useCallback } from 'react'
import axios from '@/lib/axios'
import { Plan } from '@/hooks/plans'
import { Branch } from '@/hooks/branches'

export interface Class {
    id: string
    max_students: number
    precio: number
    branch_id?: string
    plan_id?: string
    plan?: Plan
    branch?: Branch
}

export const useClasses = () => {
    const csrf = useCallback(() => axios.get('/sanctum/csrf-cookie'), [])

    const getClasses = useCallback(async () => {
        await csrf()
        try {
            const response = await axios.get('/api/classes')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [csrf])

    const getClass = useCallback(async (id: string) => {
        try {
            const response = await axios.get(`/api/classes/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    const createClass = useCallback(
        async (formData: FormData) => {
            await csrf()
            try {
                const response = await axios.post('/api/classes', formData)
                return response.data
            } catch (error) {
                console.error(error)
                throw error
            }
        },
        [csrf],
    )

    const updateClass = useCallback(
        async (id: string, formData: FormData) => {
            await csrf()
            try {
                const response = await axios.post(
                    `/api/classes/${id}?_method=PUT`,
                    formData,
                )
                return response.data
            } catch (error) {
                console.error(error)
                throw error
            }
        },
        [csrf],
    )

    const deleteClass = useCallback(
        async (id: string) => {
            await csrf()
            try {
                const response = await axios.delete(`/api/classes/${id}`)
                return response.data
            } catch (error) {
                console.error(error)
                throw error
            }
        },
        [csrf],
    )

    return {
        getClass,
        getClasses,
        createClass,
        updateClass,
        deleteClass,
    }
}
