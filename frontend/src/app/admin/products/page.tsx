'use client'

import { useState, useEffect, useRef } from 'react'
import { type Product, useProducts } from '@/hooks/products'
import {
    Plus,
    Edit2,
    Trash2,
    Package,
    ChevronDown,
    ChevronUp,
    Search,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import Link from 'next/link'

export default function ProductsPage() {
    const { getProducts, deleteProduct } = useProducts()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Product
        direction: 'asc' | 'desc'
    } | null>(null)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [showDetails, setShowDetails] = useState<boolean>(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Toggle details view for mobile
    const toggleDetails = () => {
        setShowDetails(!showDetails)
    }

    useEffect(() => {
        let isMounted = true

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(async () => {
            if (!isMounted) return

            setLoading(true)
            setError(null)

            try {
                const response = await getProducts()
                if (isMounted) {
                    const filtered = response.products.filter(
                        (product: Product) =>
                            product.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                            product.description
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()),
                    )
                    setProducts(filtered)
                    setLoading(false)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error al obtener productos')
                    console.error('Error al obtener productos:', err)
                    setLoading(false)
                }
            }
        }, 300)

        return () => {
            isMounted = false
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [searchTerm, getProducts])

    // Handle sorting
    const handleSort = (key: keyof Product) => {
        let direction: 'asc' | 'desc' = 'asc'

        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'asc'
        ) {
            direction = 'desc'
        }

        setSortConfig({ key, direction })
    }

    // Handle product selection
    const handleProductClick = (product: Product) => {
        if (selectedProduct?.id === product.id) {
            setSelectedProduct(null)
        } else {
            setSelectedProduct(product)
        }
    }

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm(
            '¿Estás seguro de que deseas eliminar este producto?',
        )
        if (!confirmDelete) return

        try {
            await deleteProduct(id)
            setProducts(products.filter(product => product.id !== id))
            if (selectedProduct?.id === id) {
                setSelectedProduct(null)
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Apply sorting
    const sortedProducts = [...products].sort((a, b) => {
        if (!sortConfig) return 0

        const { key, direction } = sortConfig
        let aValue: string | number = a[key] as string | number
        let bValue: string | number = b[key] as string | number

        // Handle numeric sorting for price and stock
        if (key === 'price' || key === 'stock') {
            aValue = Number(aValue) || 0
            bValue = Number(bValue) || 0
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1
        if (aValue > bValue) return direction === 'asc' ? 1 : -1
        return 0
    })

    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 20
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage,
    )

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
        }).format(amount)
    }

    return (
        <div className="min-h-screen w-full p-4">
            {/* Main container */}
            <div className="w-full max-w-6xl mx-auto relative z-10">
                {/* Header with title and actions */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        Productos
                    </h1>
                    <div className="flex sm:hidden justify-center mt-2">
                        <Button
                            onClick={toggleDetails}
                            variant="outline"
                            className="w-full sm:w-auto dark:text-white dark:border-gray-600">
                            {showDetails
                                ? 'Ocultar detalles'
                                : 'Mostrar más detalles'}
                        </Button>
                    </div>
                    <div className="hidden sm:flex justify-end gap-2">
                        <Link href="/admin/products/create">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Producto
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                    {/* Search */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Products table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/80 dark:bg-[#272b2b] text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => handleSort('name')}
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Nombre
                                            {sortConfig?.key === 'name' &&
                                                (sortConfig.direction ===
                                                'asc' ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() =>
                                                handleSort('description')
                                            }
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Descripción
                                            {sortConfig?.key ===
                                                'description' &&
                                                (sortConfig.direction ===
                                                'asc' ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => handleSort('price')}
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Precio
                                            {sortConfig?.key === 'price' &&
                                                (sortConfig.direction ===
                                                'asc' ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => handleSort('stock')}
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Stock
                                            {sortConfig?.key === 'stock' &&
                                                (sortConfig.direction ===
                                                'asc' ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-red-500 dark:text-red-400">
                                            {error}
                                        </td>
                                    </tr>
                                ) : sortedProducts.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <Package className="mx-auto mb-4 w-10 h-10" />
                                            <h3 className="text-lg font-semibold mb-2">
                                                No se encontraron productos
                                            </h3>
                                            <p className="mb-4 text-sm">
                                                {searchTerm
                                                    ? 'No hay resultados que coincidan con tu búsqueda.'
                                                    : 'Aún no hay productos registrados.'}
                                            </p>
                                            <Link href="/admin/products/create">
                                                <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Crear Nuevo Producto
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedProducts.map(product => (
                                        <tr
                                            key={product.id}
                                            className={`hover:bg-gray-50/50 dark:hover:bg-slate-800/70 ${
                                                selectedProduct?.id ===
                                                product.id
                                                    ? 'ring-2 ring-inset ring-purple-500'
                                                    : ''
                                            } cursor-pointer`}
                                            onClick={() =>
                                                handleProductClick(product)
                                            }>
                                            <td className="px-4 py-3 font-medium">
                                                {product.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {product.description}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
                                                {formatCurrency(
                                                    Number(product.price),
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        Number(product.stock) >
                                                        10
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                            : Number(
                                                                  product.stock,
                                                              ) > 0
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                                    }`}>
                                                    {product.stock} unidades
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/products/edit/${product.id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={e =>
                                                                e.stopPropagation()
                                                            }
                                                            className="h-8 w-8 p-0 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            handleDelete(
                                                                product.id,
                                                            )
                                                        }}
                                                        className="h-8 w-8 p-0">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center px-4 py-3 border-t dark:border-gray-700 bg-white dark:bg-[#1f2122]">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}>
                            <p className="dark:text-white">← Anterior</p>
                        </Button>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}>
                            <p className="dark:text-white">Siguiente →</p>{' '}
                        </Button>
                    </div>

                    {/* Mobile toggle details button */}
                    <div className="sm:hidden flex justify-center p-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="outline"
                            onClick={toggleDetails}
                            className="w-full dark:text-white dark:border-gray-600">
                            {showDetails
                                ? 'Ocultar detalles'
                                : 'Mostrar más detalles'}
                        </Button>
                    </div>
                </div>

                {/* Product details section */}
                {selectedProduct && (
                    <div className="mt-6 bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Detalles del Producto: {selectedProduct.name}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedProduct(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                Cerrar
                            </Button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                        Información del Producto
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <Package className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Nombre
                                                </p>
                                                <p className="dark:text-white">
                                                    {selectedProduct.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Package className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Descripción
                                                </p>
                                                <p className="dark:text-white">
                                                    {
                                                        selectedProduct.description
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Package className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Precio
                                                </p>
                                                <p className="font-semibold text-green-600 dark:text-green-400">
                                                    {formatCurrency(
                                                        Number(
                                                            selectedProduct.price,
                                                        ),
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Package className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Stock
                                                </p>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        Number(
                                                            selectedProduct.stock,
                                                        ) > 10
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                            : Number(
                                                                  selectedProduct.stock,
                                                              ) > 0
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                                    }`}>
                                                    {selectedProduct.stock}{' '}
                                                    unidades
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                        Acciones
                                    </h4>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/products/edit/${selectedProduct.id}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-2">
                                                <Edit2 className="h-4 w-4" />
                                                Editar Producto
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex items-center gap-2"
                                            onClick={() =>
                                                handleDelete(selectedProduct.id)
                                            }>
                                            <Trash2 className="h-4 w-4" />
                                            Eliminar Producto
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile new product button */}
                <div className="sm:hidden flex justify-center mt-6">
                    <Link href="/admin/products/create" className="w-full">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
