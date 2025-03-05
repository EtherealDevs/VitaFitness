import axios from '@/lib/axios'
export interface Product {
    id: string
    name: string
    price: number
    description: string
    options: JSON
    images: string[]
}

export const useProducts = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getProducts = async () => {
        try {
            const response = await axios.get('/api/products')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const getProduct = async (id: string) => {
        try {
            const response = await axios.get(`/api/products/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const createProduct = async (formData: FormData) => {
        await csrf()
        try {
            const response = await axios.post('/api/products', formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const updateProduct = async (id: string, formData: FormData) => {
        await csrf()
        try {
            const response = await axios.put(`/api/products/${id}`, formData)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const deleteProduct = async (id: string) => {
        await csrf()
        try {
            const response = await axios.delete(`/api/products/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    return {
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
    }
}
