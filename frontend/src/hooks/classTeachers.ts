import axios from '@/lib/axios'


export const useClassTeachers = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getClassTeachers = async () => {
        await csrf()
        try {
            const response = await axios.get('/api/class/teachers')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const getClassTeacher = async (id: string) => {
        try {
            const response = await axios.get(`/api/class/teachers/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const createClassTeacher = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/class/teachers', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const updateClassTeacher = async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/class/teachers/${id}?_method=PUT`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const deleteClassTeacher = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/class/teachers/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return {
        getClassTeacher,
        getClassTeachers,
        createClassTeacher,
        updateClassTeacher,
        deleteClassTeacher,
    }
}