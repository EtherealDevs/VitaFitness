'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Trash2, Upload, X } from 'lucide-react'

import Button from '@/components/ui/Button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import Input from '@/components/ui/Input'
import Label from '@/components/ui/Label'
import { Textarea } from '@/components/ui/textarea'
import { useProducts } from '@/hooks/products'
import { toast } from '@/hooks/use-toast'

interface ProductOption {
    key: string
    value: string
}

interface ProductImage {
    id: string
    url: string
    file?: File
}

export default function AddProductPage() {
    const router = useRouter()
    const { createProduct } = useProducts()
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState<ProductImage[]>([])
    const [files, setFiles] = useState<File[]>([])
    const [options, setOptions] = useState<ProductOption[]>([
        { key: '', value: '' },
    ])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setFiles(Array.from(files))

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onload = event => {
                if (event.target?.result) {
                    const newImage: ProductImage = {
                        id: `img-${Date.now()}-${Math.random()
                            .toString(36)
                            .substring(2, 9)}`,
                        url: event.target.result as string,
                        file: file,
                    }
                    setImages(prev => [...prev, newImage])
                }
            }
            reader.readAsDataURL(file)
        })

        // Reset the input value so the same file can be selected again
        e.target.value = ''
    }

    const removeImage = (id: string) => {
        setImages(images.filter(image => image.id !== id))
    }

    const addOption = () => {
        setOptions([...options, { key: '', value: '' }])
    }

    const removeOption = (index: number) => {
        const newOptions = [...options]
        newOptions.splice(index, 1)
        setOptions(newOptions)
    }

    const updateOption = (
        index: number,
        field: 'key' | 'value',
        value: string,
    ) => {
        const newOptions = [...options]
        newOptions[index][field] = value
        setOptions(newOptions)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.target as HTMLFormElement)
        const productData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price: Number.parseFloat(formData.get('price') as string),
            stock: Number.parseInt(formData.get('stock') as string),
            options: options.filter(option => option.key && option.value),
        }

        const formDataToSend = new FormData()
        formDataToSend.append('name', productData.name)
        formDataToSend.append('description', productData.description)
        formDataToSend.append('price', productData.price.toString())
        formDataToSend.append('stock', productData.stock.toString())
        files.forEach((file, index) => {
            if (file) {
                formDataToSend.append(`images[${index}]`, file)
            }
        })
        productData.options.forEach((option, index) => {
            formDataToSend.append(`options[${index}][key]`, option.key)
            formDataToSend.append(`options[${index}][value]`, option.value)
        })
        try {
            await createProduct(formDataToSend)

            toast({
                title: 'Producto creado',
                description: 'El producto ha sido creado exitosamente',
            })

            router.push('/admin/products')
        } catch (error) {
            console.error('Error creating product:', error)
            toast({
                title: 'Error',
                description: 'Hubo un error al crear el producto',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10 ">
            <Card className="dark:text-white dark:bg-zinc-950">
                <CardHeader>
                    <CardTitle className="dark:text-white">
                        Agregar Nuevo Producto
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="block">
                                Nombre
                            </Label>
                            <Input
                                className="w-full p-2 border rounded-lg dark:bg-transparent"
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Nombre del producto"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Descripción del producto"
                                className="min-h-[100px] dark:bg-transparent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="block">
                                    Precio
                                </Label>
                                <Input
                                    className="w-full p-2 border rounded-lg dark:bg-transparent"
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock" className="block">
                                    Stock
                                </Label>
                                <Input
                                    className="w-full p-2 border rounded-lg dark:bg-transparent"
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="images">Imágenes</Label>
                                <span className="text-sm text-muted-foreground">
                                    {images.length}{' '}
                                    {images.length === 1
                                        ? 'imagen'
                                        : 'imágenes'}
                                </span>
                            </div>

                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 w-full flex flex-col items-center justify-center">
                                <Input
                                    id="images"
                                    name="images"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    multiple
                                />
                                <Label
                                    htmlFor="images"
                                    className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4 w-full">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Haz clic para subir imágenes
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Puedes seleccionar múltiples imágenes
                                    </span>
                                </Label>
                            </div>

                            {images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                    {images.map(image => (
                                        <div
                                            key={image.id}
                                            className="relative group">
                                            <div className="relative w-full h-24 border rounded-md overflow-hidden">
                                                <Image
                                                    src={
                                                        image.url ||
                                                        '/placeholder.svg'
                                                    }
                                                    alt="Vista previa"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() =>
                                                    removeImage(image.id)
                                                }>
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="options">Opciones</Label>
                                <Button
                                    type="button"
                                    className="flex content-center items-center text-zinc-800 bg-transparent border border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-white rounded-lg dark:border-zinc-200 dark:text-zinc-200"
                                    onClick={addOption}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar opción
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {options.map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label
                                                htmlFor={`option-key-${index}`}
                                                className="text-sm block">
                                                Clave (ej: color, talla)
                                            </Label>
                                            <Input
                                                className="w-full p-2 border rounded-lg dark:bg-transparent"
                                                id={`option-key-${index}`}
                                                name="optionsKey"
                                                type="text"
                                                value={option.key}
                                                onChange={e =>
                                                    updateOption(
                                                        index,
                                                        'key',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="color"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Label
                                                htmlFor={`option-value-${index}`}
                                                className="text-sm block">
                                                Valor
                                            </Label>
                                            <Input
                                                className="w-full p-2 border rounded-lg dark:bg-transparent"
                                                id={`option-value-${index}`}
                                                name="optionsValue"
                                                type="text"
                                                value={option.value}
                                                onChange={e =>
                                                    updateOption(
                                                        index,
                                                        'value',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="rojo"
                                            />
                                        </div>
                                        <Button
                                            className=" hover:text-red-700 text-red-500 font-bold bg-transparent"
                                            type="button"
                                            onClick={() => removeOption(index)}
                                            disabled={options.length === 1}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                        <Button
                            className=" hover:bg-red-400 hover:text-white hover:border-white hover:border border border-red-400 text-red-400 bg-transparent"
                            type="button"
                            onClick={() => router.back()}>
                            Cancelar
                        </Button>
                        <Button
                            className="bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
                            type="submit"
                            disabled={isLoading}>
                            {isLoading ? 'Guardando...' : 'Guardar Producto'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
