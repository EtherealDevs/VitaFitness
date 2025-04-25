import axios from '@/lib/axios'


export const useClassTimeslots = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getClassTimeslots = async () => {
        await csrf()
        try {
            const response = await axios.get('/api/class/timeslots')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const getClassTimeslot = async (id: string) => {
        try {
            const response = await axios.get(`/api/class/timeslots/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    const createClassTimeslot = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/class/timeslots', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const updateClassTimeslot = async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/class/timeslots/${id}?_method=PUT`,
                formData,
            )
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const deleteClassTimeslot = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/class/timeslots/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    return {
        getClassTimeslot,
        getClassTimeslots,
        createClassTimeslot,
        updateClassTimeslot,
        deleteClassTimeslot,
    }
}