import { Student } from '@/app/admin/students/columns'
import { useCallback } from 'react'
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
    // Función para obtener el CSRF antes de cualquier acción que modifique el estado
    const csrf = useCallback(async () => {
        try {
            await axios.get('/sanctum/csrf-cookie')
        } catch (error) {
            console.error('Error al obtener el token CSRF', error)
            throw error
        }
    }, [])

    // Obtener todos los pagos
    const getPayments = useCallback(async () => {
        try {
            const response = await axios.get('/api/payments')
            return response.data
        } catch (error) {
            console.error('Error al obtener los pagos', error)
            throw error
        }
    }, [])

    // Obtener un pago específico
    const getPayment = useCallback(async (id: string) => {
        try {
            const response = await axios.get(`/api/payments/${id}`)
            return response.data
        } catch (error) {
            console.error(`Error al obtener el pago con ID: ${id}`, error)
            throw error
        }
    }, [])

    // Obtener los pagos de un estudiante específico
    const getPaymentStudent = useCallback(async (student: string) => {
        try {
            const response = await axios.get(`/api/payments/student/${student}`)
            return response.data
        } catch (error) {
            console.error('Error al obtener los pagos del estudiante', error)
            throw error
        }
    }, [])

    // Crear un nuevo pago
    const createPayment = async (data: FormData) => {
        await csrf() // Obtener CSRF antes de la creación
        try {
            const response = await axios.post('/api/payments', data)
            return response.data
        } catch (error) {
            console.error('Error al crear el pago', error)
            throw error
        }
    }

    // Actualizar un pago existente
    const updatePayment = async (id: string, data: FormData) => {
        await csrf() // Obtener CSRF antes de la actualización
        try {
            const response = await axios.post(
                `/api/payments/${id}?_method=PUT`,
                data,
            )
            return response.data
        } catch (error) {
            console.error(`Error al actualizar el pago con ID: ${id}`, error)
            throw error
        }
    }

    // Actualizar un pago de un estudiante específico
    const updatePaymentStudent = async (id: string, data: FormData) => {
        await csrf() // Obtener CSRF antes de la actualización
        try {
            const response = await axios.post(
                `/api/payments/student/${id}?_method=PUT`,
                data,
            )
            return response.data
        } catch (error) {
            console.error(
                `Error al actualizar el pago del estudiante con ID: ${id}`,
                error,
            )
            throw error
        }
    }

    // Eliminar un pago
    const deletePayment = async (id: string) => {
        await csrf() // Obtener CSRF antes de la eliminación
        try {
            const response = await axios.delete(`/api/payments/${id}`)
            return response.data
        } catch (error) {
            console.error(`Error al eliminar el pago con ID: ${id}`, error)
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
