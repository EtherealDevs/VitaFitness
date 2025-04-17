/* import useSWR from 'swr' */
import axios from '@/lib/axios'
import { useCallback } from 'react'
/* import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

 */

export const useTeachers = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getTeachers = useCallback(async () => {
        await csrf()
        try {
            const response = await axios.get('/api/teachers')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])
    const getTeacher = useCallback(async (id: string) => {
        try {
            const response = await axios.get(`/api/teachers/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])
    const createTeacher = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/teachers', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const updateTeacher = async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/teachers/${id}?_method=PUT`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const deleteTeacher = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/teachers/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return {
        getTeachers,
        getTeacher,
        createTeacher,
        updateTeacher,
        deleteTeacher,
    }
}
