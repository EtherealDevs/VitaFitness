import axios from '@/lib/axios'


export const useClassStudents = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getClassStudents = async () => {
        await csrf()
        try {
            const response = await axios.get('/api/class/students')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const getClassStudent = async (id: string) => {
        try {
            const response = await axios.get(`/api/class/students/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const createClassStudent = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/class/students', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const updateClassStudent = async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/class/students/${id}?_method=PUT`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const deleteClassStudent = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/class/students/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return {
        getClassStudent,
        getClassStudents,
        createClassStudent,
        updateClassStudent,
        deleteClassStudent,
    }
}