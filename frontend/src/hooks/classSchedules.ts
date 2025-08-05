/* import useSWR from 'swr' */
import axios from '@/lib/axios'
import { useCallback } from 'react'
/* import { useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation' */

// export interface Class {
//     id: string
//     max_students: number
//     precio: number
//     branch_id: string
//     plan_id: string
//     plan?: Plan
//     branch?: Branch
// }

export const useClassSchedules = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getClassSchedules = useCallback(async () => {
        await csrf()
        try {
            const response = await axios.get('/api/classSchedules')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])
    const getClassSchedule = useCallback(async (id: string) => {
        try {
            const response = await axios.get(`/api/classSchedules/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])
    const getClassScheduleClassNames = useCallback(async () => {
        try {
            const response = await axios.get(`/api/classSchedules/classNames`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])
    const createClassSchedule = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/classSchedules', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const updateClassSchedule = async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/classSchedules/${id}?_method=PUT`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const deleteClassSchedule = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/classSchedules/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return {
        getClassScheduleClassNames,
        getClassSchedule,
        getClassSchedules,
        createClassSchedule,
        updateClassSchedule,
        deleteClassSchedule,
    }
}
