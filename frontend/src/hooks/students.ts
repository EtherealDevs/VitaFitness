// import useSWR from 'swr'
import axios from '@/lib/axios'
import { useCallback } from 'react'
/* import { useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation' */

export const useStudents = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getStudents = async () => {
        await csrf()
        try {
            const response = await axios.get('/api/students')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const getStudent = useCallback(async (id: string) => {
        try {
            const response = await axios.get(`/api/students/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])
    const createStudent = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/students', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const updateStudent = async (id: string, formData: FormData) => {
        await csrf()
        console.log(formData)
        try {
            const response = await axios.post(
                `/api/students/${id}?_method=PUT`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const deleteStudent = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/students/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return {
        getStudents,
        getStudent,
        createStudent,
        updateStudent,
        deleteStudent,
    }

    // const { data } = useSWR('/api/students', () =>
    //     axios
    //         .get('/api/students')
    //         .then(res => res.data)
    //         .catch(error => {
    //             if (error.response.status !== 409) throw error

    //             router.push('/verify-email')
    //         }),
    // )
}
