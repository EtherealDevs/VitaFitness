import { Student } from '@/app/admin/students/columns'
import axios from '@/lib/axios'

export interface Payment {
    id: string
    classSchedule_id: string
    student_id: string
    student: Student
    date_start: string
    amount: number
    status: string
    payment_date: string
    expiration_date: string
    created_at: string
    updated_at: string
}

export const usePayments = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getPayments = async () => {
        try {
            const response = await axios.get('/api/payments')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const getPayment = async (id: string) => {
        try {
            const response = await axios.get(`/api/payments/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const getPaymentStudent = async (student: string) => {
        try {
            const response = await axios.get(`/api/payments/student/${student}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const createPayment = async (data: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/payments', data)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const updatePayment = async (id: string, data: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/payments/${id}?_method=PUT`,
                data,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const updatePaymentStudent = async (id: string, data: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/payments/student/${id}?_method=PUT`,
                data,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const deletePayment = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/payments/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return {
        createPayment,
        updatePayment,
        getPayment,
        getPayments,
        getPaymentStudent,
        updatePaymentStudent,
        deletePayment,
    }
}
