import axios from '@/lib/axios'
import { useCallback } from 'react'

export interface TimeSlot {
    id: string
    hour: [string]
}
export interface Schedule {
    id: string
    days: [string]
    timeslots: [TimeSlot]
    selectedDays?: [string]
    time_start?: string
    time_end?: string
}
export const useSchedules = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getSchedules = useCallback(async () => {
        try {
            const response = await axios.get('/api/schedules')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    const getSchedule = useCallback(async (id: string) => {
        try {
            const response = await axios.get(`/api/schedules/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

    const createSchedule = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/schedules', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const updateSchedule = async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/schedules/${id}?_method=PUT`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const deleteSchedule = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/schedules/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    return {
        getSchedules,
        getSchedule,
        createSchedule,
        updateSchedule,
        deleteSchedule,
    }
}
