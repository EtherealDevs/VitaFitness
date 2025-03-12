'use client'
import { Product, useProducts } from '@/hooks/products'
import Link from 'next/link'
import { useEffect, useState } from 'react'
export default function ProductsPage() {
    const { getProducts, deleteProduct } = useProducts()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)

    async function fetchProducts() {
        setLoading(true)
        try {
            const response = await getProducts()
            console.log(response)
            setProducts(response.products)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchProducts()
    }, [])

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id)
            setProducts(products.filter(product => product.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    return loading ? (
        <div>loading...</div>
    ) : (
        <div className="space-y-4 overflow-x-auto">
            <div className=" flex justify-between align-bottom">
                <div className="flex space-x-4">
                    <h1 className="text-2xl md:text-4xl font-extrabold">
                        Productos
                    </h1>
                    <button className="py-1 px-2 sm:py-2 sm:px-4 bg-blue-600  rounded-xl">
                        filtros
                    </button>
                </div>
                <Link href="/admin/products/create">
                    <button className="py-2 px-4 bg-blue-600  rounded-xl">
                        nuevo producto
                    </button>
                </Link>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 rounded-lg">
                {/* desktop view */}
                <div className="hidden md:block w-full">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-lg ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr className="rounded-lg">
                                <th scope="col" className="px-6 py-3">
                                    Product name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Descripcion
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Price
                                </th>
                                <th
                                    scope="col"
                                    colSpan={2}
                                    className="px-6 py-3 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-white  even:bg-gray-100  border-gray-200">
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                        {product.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {product.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        ${product.price}
                                    </td>
                                    <td className=" p-4">
                                        <button
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                            className="py-2 px-4 bg-red-600 rounded-xl">
                                            Eliminar
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <Link
                                            href={`/admin/products/edit/${product.id}`}
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* mobile view */}
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
            </div>
        </div>
    )
}
