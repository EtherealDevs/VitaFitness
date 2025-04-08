/* import useSWR from 'swr' */
import axios from '@/lib/axios'
import { Plan } from '@/hooks/plans'
import { Branch } from '@/hooks/branches'
/* import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation' */

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
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getClasses = async () => {
        await csrf()
        try {
            const response = await axios.get('/api/classes')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const getClass = async (id: string) => {
        try {
            const response = await axios.get(`/api/classes/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const createClass = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/classes', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const updateClass = async (id: string, formData: FormData) => {
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
    }

    const deleteClass = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/classes/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return {
        getClass,
        getClasses,
        createClass,
        updateClass,
        deleteClass,
    }
}
