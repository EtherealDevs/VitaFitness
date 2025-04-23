import { useCallback } from 'react'
import axios from '@/lib/axios'

export const useAttendances = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const getAttendances = useCallback(async () => {
        await csrf()
        try {
            const response = await axios.get('/api/attendances')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])
    const getAttendancesForCurrentStudent = useCallback(async () => {
        await csrf()
        try {
            const response = await axios.get('/api/attendances/getAllForCurrent')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    const getAttendance = useCallback(async (id: string) => {
        try {
            const response = await axios.get(`/api/attendances/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    const createAttendance = useCallback(async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/attendances', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    const updateAttendance = useCallback(async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/attendances/${id}?_method=PUT`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    const deleteAttendance = useCallback(async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/attendances/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    return {
        getAttendance,
        getAttendances,
        createAttendance,
        updateAttendance,
        deleteAttendance,
        getAttendancesForCurrentStudent,
    }
}