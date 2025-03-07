'use client'
import Input from '@/components/ui/Input'
import { useProducts } from '@/hooks/products'
import { useState } from 'react'
export default function CreateProduct() {
    const { createProduct } = useProducts()
    const [file, setFile] = useState<File | null>(null)
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        options: '',
    })
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target
        setProduct(prevInfo => ({
            ...prevInfo,
            [name]: value,
        }))
    }
    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData()
        if (file) {
            formData.append('image', file)
        }
        formData.append('name', product.name)
        formData.append('description', product.description)
        formData.append('price', product.price)
        formData.append('stock', product.stock)
        if (product.options) {
            formData.append('options', product.options)
        }

        const response = await createProduct(formData)
        console.log(response)
    }

    return (
        <div>
            <form onSubmit={submitForm}>
                <input
                    type="file"
                    onChange={e => {
                        if (e.target.files) {
                            setFile(e.target.files[0])
                        }
                    }}
                />
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                />
                <Input
                    id="description"
                    type="text"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                />
                <Input
                    id="price"
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                    placeholder="Enter product price"
                />
                <Input
                    id="stock"
                    type="number"
                    name="stock"
                    value={product.stock}
                    onChange={handleInputChange}
                    placeholder="Enter product stock"
                />
                <Input
                    id="options"
                    type="text"
                    name="options"
                    value={product.options}
                    onChange={handleInputChange}
                    placeholder="Enter product options"
                />

                <select name="status" id="status">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
