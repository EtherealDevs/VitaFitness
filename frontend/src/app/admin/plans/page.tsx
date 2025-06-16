'use client'

import { type Plan, usePlans } from '@/hooks/plans'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import {
    Plus,
    Edit2,
    Trash2,
    FileText,
    ChevronDown,
    ChevronUp,
    Search,
} from 'lucide-react'
import { Button } from '@/app/admin/components/ui/button'

export default function PlansPage() {
    const { getPlans, deletePlan } = usePlans()
    const [plans, setPlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Plan
        direction: 'asc' | 'desc'
    } | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
    const [showDetails, setShowDetails] = useState<boolean>(false)

    // Toggle details view for mobile
    const toggleDetails = () => {
        setShowDetails(!showDetails)
    }

    const fetchPlans = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await getPlans()
            setPlans(response.plans)
            setLoading(false)
        } catch (err) {
            setError('Error al cargar los planes')
            console.error(err)
            setLoading(false)
        }
    }, [getPlans])

    useEffect(() => {
        fetchPlans()
    }, [fetchPlans])

    // Handle sorting
    const handleSort = (key: keyof Plan) => {
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

    // Handle plan selection
    const handlePlanClick = (plan: Plan) => {
        if (selectedPlan?.id === plan.id) {
            setSelectedPlan(null)
        } else {
            setSelectedPlan(plan)
        }
    }

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm('¿Estás seguro de eliminar este plan?')
        if (!confirmDelete) return

        try {
            await deletePlan(id)
            setPlans(plans.filter(plan => plan.id !== id))
            if (selectedPlan?.id === id) {
                setSelectedPlan(null)
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Apply sorting and filtering
    const filteredAndSortedPlans = [...plans]
        .filter(
            plan =>
                plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plan.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                plan.status.toLowerCase().includes(searchTerm.toLowerCase()),
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
    const plansPerPage = 20
    const totalPages = Math.ceil(filteredAndSortedPlans.length / plansPerPage)
    const paginatedPlans = filteredAndSortedPlans.slice(
        (currentPage - 1) * plansPerPage,
        currentPage * plansPerPage,
    )

    return (
        <div className="min-h-screen w-full p-4">
            {/* Main container */}
            <div className="w-full max-w-6xl mx-auto relative z-10">
                {/* Header with title and actions */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        Planes
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
                        <Link href="/admin/plans/create">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Plan
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
                                placeholder="Buscar planes..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Plans table */}
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
                                            onClick={() => handleSort('status')}
                                            className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                            Estado
                                            {sortConfig?.key === 'status' &&
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
                                            colSpan={4}
                                            className="px-4 py-8 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-8 text-center text-red-500 dark:text-red-400">
                                            {error}
                                        </td>
                                    </tr>
                                ) : filteredAndSortedPlans.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <FileText className="mx-auto mb-4 w-10 h-10" />
                                            <h3 className="text-lg font-semibold mb-2">
                                                No se encontraron planes
                                            </h3>
                                            <p className="mb-4 text-sm">
                                                {searchTerm
                                                    ? 'No hay resultados que coincidan con tu búsqueda.'
                                                    : 'Aún no hay planes registrados.'}
                                            </p>
                                            <Link href="/admin/plans/create">
                                                <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Crear Nuevo Plan
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedPlans.map(plan => (
                                        <tr
                                            key={plan.id}
                                            className={`hover:bg-gray-50/50 dark:hover:bg-slate-800/70 ${
                                                selectedPlan?.id === plan.id
                                                    ? 'ring-2 ring-inset ring-purple-500'
                                                    : ''
                                            } cursor-pointer`}
                                            onClick={() =>
                                                handlePlanClick(plan)
                                            }>
                                            <td className="px-4 py-3 font-medium">
                                                {plan.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {plan.description}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        plan.status.toLowerCase() ===
                                                        'activo'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                            : plan.status.toLowerCase() ===
                                                              'inactivo'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                    }`}>
                                                    {plan.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/plans/edit/${plan.id}`}>
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
                                                                plan.id,
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

                {/* Plan details section */}
                {selectedPlan && (
                    <div className="mt-6 bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg rounded-lg border border-opacity-50 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Detalles del Plan: {selectedPlan.name}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPlan(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                Cerrar
                            </Button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                        Información del Plan
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Nombre
                                                </p>
                                                <p className="dark:text-white">
                                                    {selectedPlan.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Descripción
                                                </p>
                                                <p className="dark:text-white">
                                                    {selectedPlan.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Estado
                                                </p>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        selectedPlan.status.toLowerCase() ===
                                                        'activo'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                            : selectedPlan.status.toLowerCase() ===
                                                              'inactivo'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                    }`}>
                                                    {selectedPlan.status}
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
                                            href={`/admin/plans/edit/${selectedPlan.id}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-2">
                                                <Edit2 className="h-4 w-4" />
                                                Editar Plan
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex items-center gap-2"
                                            onClick={() =>
                                                handleDelete(selectedPlan.id)
                                            }>
                                            <Trash2 className="h-4 w-4" />
                                            Eliminar Plan
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile new plan button */}
                <div className="sm:hidden flex justify-center mt-6">
                    <Link href="/admin/plans/create" className="w-full">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                            <Plus className="mr-2 h-4 w-4" />
                            Crear Plan
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
