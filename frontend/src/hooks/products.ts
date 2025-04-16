import { useCallback } from 'react'
import axios from '@/lib/axios'

export interface Product {
    id: string
    name: string
    price: number
    description: string
    stock: number
    options: JSON
    images: string[]
}

export const useProducts = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const getProducts = useCallback(async () => {
        try {
            const response = await axios.get('/api/products')
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [])

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
            const response = await axios.post(
                `/api/products/${id}?_method=PUT`,
                formData,
            )
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
