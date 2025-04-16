'use client'

import { useState, useEffect, useRef } from 'react'
import { type Product, useProducts } from '@/hooks/products'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import Link from 'next/link'

export default function ProductsPage() {
    const { getProducts, deleteProduct } = useProducts()
    const [products, setProducts] = useState<Product[]>([])
    const [search, setSearch] = useState('')
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(async () => {
            try {
                const response = await getProducts()
                const filtered = response.products.filter(
                    (product: Product) =>
                        product.name
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                        product.description
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                )
                setProducts(filtered)
            } catch (error) {
                console.error('Error al obtener productos:', error)
            }
        }, 300)

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [search, getProducts])

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm(
            '¿Estás seguro de que deseas eliminar este producto?',
        )
        if (!confirmDelete) return

        try {
            await deleteProduct(id)
            setProducts(products.filter(product => product.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Productos</h1>
            </div>

            <div className="flex items-center gap-4">
                <Input
                    placeholder="Buscar producto..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Lista de Productos</CardTitle>
                    <Link href="/admin/products/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <Link
                                                href={`/admin/products/edit/${product.id}`}
                                                className="font-medium hover:underline">
                                                {product.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {product.description}
                                        </TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(product.id)
                                                    }>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Responsive para móvil */}
                    <div className="block sm:hidden space-y-4">
                        {products.map(product => (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {product.name}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {product.description}
                                </p>
                                <p className="text-md font-bold text-gray-900 dark:text-gray-200 mt-2">
                                    ${product.price}
                                </p>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="py-2 px-4 bg-red-600 text-white rounded-lg w-full hover:bg-red-700"
                                        aria-label={`Eliminar ${product.name}`}>
                                        Eliminar
                                    </button>
                                    <Link
                                        href={`/admin/products/edit/${product.id}`}
                                        className="py-2 px-4 bg-blue-600 text-white rounded-lg w-full text-center hover:bg-blue-700">
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
