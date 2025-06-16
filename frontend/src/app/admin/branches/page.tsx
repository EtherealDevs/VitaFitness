'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Building,
    Search,
    Plus,
    Edit2,
    Trash2,
    MapPin,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'
import { Button } from '@/app/admin/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Branch, useBranches } from '@/hooks/branches'

export default function BranchesPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [branches, setBranches] = useState<Branch[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Branch
        direction: 'asc' | 'desc'
    } | null>(null)
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
    const [showDetails, setShowDetails] = useState<boolean>(false)

    const { getBranches, deleteBranch } = useBranches()

    // Toggle details view for mobile
    const toggleDetails = () => {
        setShowDetails(!showDetails)
    }

    useEffect(() => {
        let isMounted = true

        const fetchBranches = async () => {
            setLoading(true)
            setError(null)

            try {
                const res = await getBranches()
                if (isMounted) {
                    setBranches(res?.branches || res?.data?.branches || [])
                    setLoading(false)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error al cargar los datos de sucursales')
                    console.error(err)
                    setLoading(false)
                }
            }
        }

        fetchBranches()

        return () => {
            isMounted = false
        }
    }, [getBranches])

    // Handle sorting
    const handleSort = (key: keyof Branch) => {
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

    // Handle branch selection
    const handleBranchClick = (branch: Branch) => {
        if (selectedBranch?.id === branch.id) {
            setSelectedBranch(null)
        } else {
            setSelectedBranch(branch)
        }
    }

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm(
            '¿Estás seguro de que deseas eliminar esta sucursal?',
        )
        if (!confirmDelete) return

        try {
            await deleteBranch(id)
            setBranches(branches.filter(branch => branch.id !== id))
            if (selectedBranch?.id === id) {
                setSelectedBranch(null)
            }
            toast({
                title: 'Sucursal eliminada',
                description: 'La sucursal ha sido eliminada exitosamente',
                variant: 'default',
            })
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error al eliminar la sucursal',
                description: 'No se ha podido eliminar la sucursal',
                variant: 'destructive',
            })
        }
    }

    // Apply sorting and filtering
    const filteredAndSortedBranches = [...branches]
        .filter(
            branch =>
                branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                branch.address.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .sort((a, b) => {
            if (!sortConfig) return 0

            const { key, direction } = sortConfig
            const aValue = a[key] as string
            const bValue = b[key] as string

            if (aValue < bValue) return direction === 'asc' ? -1 : 1
            if (aValue > bValue) return direction === 'asc' ? 1 : -1
            return 0
        })

    const [currentPage, setCurrentPage] = useState(1)
    const branchesPerPage = 20
    const totalPages = Math.ceil(
        filteredAndSortedBranches.length / branchesPerPage,
    )
    const paginatedBranches = filteredAndSortedBranches.slice(
        (currentPage - 1) * branchesPerPage,
        currentPage * branchesPerPage,
    )

    return (
        <div className="min-h-screen w-full p-4">
            {/* Main container */}
            <div className="w-full max-w-6xl mx-auto relative z-10">
                {/* Header with title and actions */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        Sucursales
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
                        <Link href="/admin/branches/create">
                            <Button className="dark:text-white text-black">
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva Sucursal
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
                                placeholder="Buscar sucursales..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Branches table */}
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
                                                handleSort('address')
                                            }
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Dirección
                                            {sortConfig?.key === 'address' &&
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
                                            colSpan={3}
                                            className="px-4 py-8 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-8 text-center text-red-500 dark:text-red-400">
                                            {error}
                                        </td>
                                    </tr>
                                ) : filteredAndSortedBranches.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <Building className="mx-auto mb-4 w-10 h-10" />
                                            <h3 className="text-lg font-semibold mb-2">
                                                No se encontraron sucursales
                                            </h3>
                                            <p className="mb-4 text-sm">
                                                {searchTerm
                                                    ? 'No hay resultados que coincidan con tu búsqueda.'
                                                    : 'Aún no hay sucursales registradas.'}
                                            </p>
                                            <Link href="/admin/branches/create">
                                                <Button>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Crear Nueva Sucursal
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedBranches.map(branch => (
                                        <tr
                                            key={branch.id}
                                            className={`hover:bg-gray-50/50 dark:hover:bg-slate-800/70 ${
                                                selectedBranch?.id === branch.id
                                                    ? 'ring-2 ring-inset ring-purple-500'
                                                    : ''
                                            } cursor-pointer`}
                                            onClick={() =>
                                                handleBranchClick(branch)
                                            }>
                                            <td className="px-4 py-3 font-medium">
                                                {branch.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-start gap-1">
                                                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                                    <span>
                                                        {branch.address}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            router.push(
                                                                `/admin/branches/edit/${branch.id}`,
                                                            )
                                                        }}
                                                        className="h-8 w-8 p-0 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            handleDelete(
                                                                branch.id,
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
                            ← Anterior
                        </Button>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}>
                            Siguiente →
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

                {/* Branch details section */}
                {selectedBranch && (
                    <div className="mt-6 bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Detalles de la Sucursal: {selectedBranch.name}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedBranch(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                Cerrar
                            </Button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                        Información General
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <Building className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Nombre
                                                </p>
                                                <p className="dark:text-white">
                                                    {selectedBranch.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Dirección
                                                </p>
                                                <p className="dark:text-white">
                                                    {selectedBranch.address}
                                                </p>
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
                                            href={`/admin/branches/edit/${selectedBranch.id}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-2">
                                                <Edit2 className="h-4 w-4" />
                                                Editar Sucursal
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex items-center gap-2"
                                            onClick={() =>
                                                handleDelete(selectedBranch.id)
                                            }>
                                            <Trash2 className="h-4 w-4" />
                                            Eliminar Sucursal
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile new branch button */}
                <div className="sm:hidden flex justify-center mt-6">
                    <Link href="/admin/branches/create" className="w-full">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Sucursal
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
