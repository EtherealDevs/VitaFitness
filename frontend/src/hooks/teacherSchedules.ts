/* import useSWR from 'swr' */
import axios from '@/lib/axios'
import { useCallback } from 'react'
/* import { useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation' */

export const useTeacherSchedules = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getTeacherSchedules = useCallback(async () => {
        await csrf()
        try {
            const response = await axios.get('api/class/teachers')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])
    const getTeacherSchedule = useCallback(async (id: string) => {
        try {
            const response = await axios.get(`/api/class/teachers/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])
    const createTeacherSchedule = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/teacherSchedules', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const updateTeacherSchedule = async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/teacherSchedules/${id}?_method=PUT`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const deleteTeacherSchedule = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/teacherSchedules/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return {
        getTeacherSchedules,
        getTeacherSchedule,
        createTeacherSchedule,
        updateTeacherSchedule,
        deleteTeacherSchedule,
    }
}
